import { Module } from "@nestjs/common";
import { SnsController } from "./sns.controller";
import { SnsService } from "./sns.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        HttpModule,
    ],
    controllers: [ SnsController ],
    providers: [ SnsService ],
    exports: [ SnsService ],
})
export class SnsModule {}
