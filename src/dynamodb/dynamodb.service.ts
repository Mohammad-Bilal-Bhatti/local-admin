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
    CreateTableCommandOutput,
    UpdateItemCommand,
    UpdateItemCommandOutput,
    PutItemCommand,
    PutItemCommandOutput,
    StreamViewType,
    ScalarAttributeType,
} from '@aws-sdk/client-dynamodb';
import { ConfigService } from "@nestjs/config";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigureInput } from "src/app.dto";
import {
    ListStreamsCommand,
    ListStreamsCommandOutput,
    DescribeStreamCommand,
    DescribeStreamCommandOutput,
} from "@aws-sdk/client-dynamodb-streams";

@Injectable()
export class DynamoDbService implements ConfigurableService {

    private client: DynamoDBClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new DynamoDBClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new DynamoDBClient({
            endpoint: configuration.endpoint,
            region: configuration.region
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
        hashAttributeType: ScalarAttributeType,
        readCapacityUnits: number,
        writeCapacityUnits: number,
        streamEnabled: boolean,
        streamViewType: StreamViewType,
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
            StreamSpecification: streamEnabled ? {
                StreamEnabled: streamEnabled,
                StreamViewType: streamViewType
            }: null
        });

        const response = await this.client.send(command);
        return response;

    }

    async updateItem(tableName: string, key: any, item: any): Promise<UpdateItemCommandOutput> {

        const updateAttributes = {};
        for (const key in item) {
            if (key === 'id') continue;

            updateAttributes[key] = {
                Value: item[key],
                Action: 'PUT',
            }
        }

        const command = new UpdateItemCommand({
            TableName: tableName,
            Key: {
                'id': key
            },
            AttributeUpdates: updateAttributes,
        });
        const response = await this.client.send(command);
        return response;
    }

    async putTableItem(tableName: string, item: any): Promise<PutItemCommandOutput> {
        const command = new PutItemCommand({
            TableName: tableName,
            Item: item,
        });
        const response = await this.client.send(command);
        return response;
    }

    async listStreams(): Promise<ListStreamsCommandOutput> {
        const command = new ListStreamsCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async describeStream(streamArn: string): Promise<DescribeStreamCommandOutput> {
        const command = new DescribeStreamCommand({
            StreamArn: streamArn,
        });
        const response = await this.client.send(command);
        return response;
    }

}
