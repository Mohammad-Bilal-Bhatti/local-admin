import { Module } from "@nestjs/common";
import { SesController } from "./ses.controller";
import { SesService } from "./ses.service";

@Module({
    imports: [],
    controllers: [ SesController ],
    providers: [ SesService ],
    exports: [ SesService ],
})
export class SesModule {}
