import { Module } from "@nestjs/common";
import { SqsService } from "./sqs.service";
import { SqsController } from "./sqs.controller";

@Module({
    imports: [],
    controllers: [ SqsController ],
    providers: [ SqsService ],
    exports: [ SqsService ]
})
export class SqsModule {}

