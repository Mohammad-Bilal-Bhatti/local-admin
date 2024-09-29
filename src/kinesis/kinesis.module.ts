import { Module } from "@nestjs/common";
import { KinesisController } from "./kinesis.controller";
import { KinesisService } from "./kinesis.service";

@Module({
    imports: [],
    controllers: [ KinesisController ],
    providers: [ KinesisService ],
    exports: [ KinesisService ],
})
export class KinesisModule {}
