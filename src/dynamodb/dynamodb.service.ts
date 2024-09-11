import { Injectable } from "@nestjs/common";
import { 
    DynamoDBClient,
    ListTablesCommand,
    ListTablesCommandOutput,
    DescribeTableCommand,
    DescribeTableCommandOutput,
    DeleteTableCommand,
    DeleteTableCommandOutput,
    ScanCommand,
    ScanCommandOutput,
    DeleteItemCommand,
    DeleteItemCommandOutput,
    GetItemCommand,
    GetItemCommandOutput,
    CreateTableCommand,
    CreateTableCommandInput,
    CreateTableCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DynamoDbService {

    private client: DynamoDBClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new DynamoDBClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
    }

    async getTableList(): Promise<ListTablesCommandOutput> {
        const command = new ListTablesCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async describeTable(tableName: string): Promise<DescribeTableCommandOutput> {
        const command = new DescribeTableCommand({
            TableName: tableName,
        });
        const response = await this.client.send(command);
        return response;
    }

    async removeTable(table: string): Promise<DeleteTableCommandOutput> {
        const command = new DeleteTableCommand({ TableName: table });
        const response = await this.client.send(command);
        return response;
    }

    async scanTable(table: string): Promise<ScanCommandOutput> {
        const command = new ScanCommand({ TableName: table });
        const response = await this.client.send(command);
        return response;
    }

    async deleteItem(table: string, key: any): Promise<DeleteItemCommandOutput> {
        const command = new DeleteItemCommand({ TableName: table, Key: key });
        const response = await this.client.send(command);
        return response;        
    }

    async getItem(table: string, key: any): Promise<GetItemCommandOutput> {
        const command = new GetItemCommand({
            TableName: table,
            Key: key,
        });
        const response = await this.client.send(command);
        return response;

    }

    async createTable(
        name: string, 
        hashAttributeName: string, 
        hashAttributeType: 'B' | 'N' | 'S',
        readCapacityUnits: number,
        writeCapacityUnits: number,
    ): Promise<CreateTableCommandOutput> {

        const command = new CreateTableCommand({
            TableName: name,
            AttributeDefinitions: [
                { AttributeName: hashAttributeName, AttributeType: hashAttributeType },
            ],
            KeySchema: [
                { AttributeName: hashAttributeName, KeyType: 'HASH' },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: isNaN(readCapacityUnits) ? 1 : readCapacityUnits,
                WriteCapacityUnits: isNaN(writeCapacityUnits) ? 1 : writeCapacityUnits,
            },
        });

        const response = await this.client.send(command);
        return response;

    }

}