import { Module } from "@nestjs/common";
import { SecretsManagerController } from "./secrets-manager.controller";
import { SecretsManagerService } from "./secrets-manager.service";

@Module({
    imports: [],
    controllers: [ SecretsManagerController ],
    providers: [ SecretsManagerService ],
    exports: [ SecretsManagerService ],
})
export class SecretsManagerModule {}
