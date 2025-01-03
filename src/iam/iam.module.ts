import { Module } from "@nestjs/common";
import { IamController } from "./iam.controller";
import { IamService } from "./iam.service";

@Module({
    imports: [],
    controllers: [ IamController ],
    providers: [ IamService ],
    exports: [ IamService ],
})
export class IamModule {}