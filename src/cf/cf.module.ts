import { Module } from "@nestjs/common";
import { CFController } from "./cf.controller";
import { CFService } from "./cf.service";

@Module({
    imports: [],
    controllers: [ CFController ],
    providers: [ CFService ],
    exports: [ CFService ],
})
export class CFModule {}
