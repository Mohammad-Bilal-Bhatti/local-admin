import { Module } from "@nestjs/common";
import { SfnController } from "./sfn.controller";
import { SfnService } from "./sfn.service";

@Module({
    imports: [],
    controllers: [ SfnController ],
    providers: [ SfnService ],
    exports: [ SfnService ],
})
export class SfnModule {}
