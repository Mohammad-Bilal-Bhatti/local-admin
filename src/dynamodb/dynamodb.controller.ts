import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { DynamoDbService } from "./dynamodb.service";
import { CreateTableInput } from "./dynamodb.dto";

@Controller('dynamodb')
export class DynamoDbController {

    constructor(private readonly service: DynamoDbService) {}

    @Get()
    @Render('dynamodb-list-tables')
    async getTables() {
        const result = await this.service.getTableList();

        const tables = [];
        for (const tableName of result.TableNames) {
            const tableDescription = await this.service.describeTable(tableName);
            tables.push({ name: tableName, details: tableDescription.Table });
        }

        return { tables };
    }

    @Get('create-table')
    @Render('dynamodb-create-table')
    async getCreateTable(@Res() res: Response) {
        return null;
    }

    @Post('create-table')
    @Redirect('/dynamodb', 302)
    async createTable(@Body() input: CreateTableInput) {
        const result = await this.service.createTable(
            input.name, 
            input.hashAttributeName, 
            input.hashAttributeType, 
            parseInt(input.readCapacityUnits, 3),
            parseInt(input.writeCapacityUnits, 3),
        );
        return null;
    }

    @Get('details')
    @Render('dynamodb-table-details')
    async getTableDetails(@Query('table') table: string) {

        const response = await this.service.describeTable(table);
        const items = await this.service.scanTable(table);

        const rows = items.Items;
        const keys = Object.keys(rows[0]);

        const columns = keys.map(key => {
            const value = rows[0][key];
            const firstsubkey = Object.keys(value)[0];
            return { title: key, accessor: `${key}.${firstsubkey}` };
        });

        return { table, details: response.Table, columns, rows, items: items.Items };
    }

    @Get('view-item')
    @Render('dynamodb-item-details')
    async viewItem(@Query('table') table: string, @Query('key') key: string) {
        const _key = JSON.parse(key.trim());
        const item = await this.service.getItem(table, { id: _key });
        return { table, key, details: item.Item };
    }

    @Get('delete-item')
    async deleteItem(@Res() res: Response, @Query('table') table: string, @Query('key') key: string) {
        const _key = JSON.parse(key.trim());
        const item = await this.service.deleteItem(table, { id: _key });
        return res.redirect(302, `/dynamodb/details?table=${table}`);
    }

    @Get('remove')
    @Redirect('/dynamodb', 302)
    async removeTable(@Query('table') table: string) {
        const response = await this.service.removeTable(table);
        return null;
    }

    @Get('purge')
    @Redirect('/dynamodb', 302)
    async purgeTable(@Query('table') table: string) {

        const detail = await this.service.describeTable(table);

        const keyname = detail.Table.KeySchema[0].AttributeName;

        const response = await this.service.scanTable(table);
        if (response.Count) {
            for (const row of response.Items) {
                const key = { [keyname]: row[keyname] };       
                const dresult = await this.service.deleteItem(table, key);
            }    
        }
        return null;
    }

}
