import { Module } from "@nestjs/common";
import { AcmService } from "./acm.service";
import { AcmController } from "./acm.controller";

@Module({
    imports: [],
    controllers: [ AcmController ],
    providers: [ AcmService ],
    exports: [ AcmService ],
})
export class AcmModule {}
