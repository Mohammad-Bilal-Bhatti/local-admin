
export class CreateTableInput {
    name: string;
    hashAttributeName: string;
    hashAttributeType: 'B' | 'N' | 'S';
    readCapacityUnits: string;
    writeCapacityUnits: string;
}
