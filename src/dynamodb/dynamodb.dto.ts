
export class CreateTableInput {
    name: string;
    hashAttributeName: string;
    hashAttributeType: 'B' | 'N' | 'S';
    readCapacityUnits: string;
    writeCapacityUnits: string;
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