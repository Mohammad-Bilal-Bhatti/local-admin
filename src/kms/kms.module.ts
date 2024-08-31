import { Module } from "@nestjs/common";
import { KmsService } from "./kms.service";
import { KmsController } from "./kms.controller";

@Module({
    imports: [],
    controllers: [ KmsController ],
    providers: [ KmsService ],
    exports: [ KmsService ],
})
export class KmsModule {}
