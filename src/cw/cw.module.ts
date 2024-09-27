import { Module } from "@nestjs/common";
import { CwController } from "./cw.controller";
import { CWService } from "./cw.service";

@Module({
    imports: [],
    controllers: [ CwController ],
    providers: [ CWService ],
    exports: [ CWService ],
})
export class CwModule {}
