import { StreamViewType, ScalarAttributeType } from '@aws-sdk/client-dynamodb'

export class CreateTableInput {
    name: string;
    hashAttributeName: string;
    hashAttributeType: ScalarAttributeType;
    readCapacityUnits: string;
    writeCapacityUnits: string;
    streamEnabled: string;
    streamViewType: StreamViewType;
}

export class UpdateItemDto {
    tableName: string;
    key: string; 
    item: string;
}

export class CreateItemDto {
    tableName: string;
    item: string;
}

export { StreamViewType, ScalarAttributeType } from '@aws-sdk/client-dynamodb';