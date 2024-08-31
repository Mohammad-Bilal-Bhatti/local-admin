import { Module } from "@nestjs/common";
import { SsmController } from "./ssm.controller";
import { SsmService } from "./ssm.service";

@Module({
    imports: [],
    controllers: [ SsmController ],
    providers: [ SsmService ],
    exports: [ SsmService ],
})
export class SsmModule {}
