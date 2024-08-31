import { Module } from "@nestjs/common";
import { DynamoDbController } from "./dynamodb.controller";
import { DynamoDbService } from "./dynamodb.service";

@Module({
    imports: [],
    controllers: [ DynamoDbController ],
    providers: [ DynamoDbService ],
    exports: [ DynamoDbService ],
})
export class DynamoDbModule {}
