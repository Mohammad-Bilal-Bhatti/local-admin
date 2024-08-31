import { Module } from "@nestjs/common";
import { LambdaController } from "./lambda.controller";
import { LambdaService } from "./lambda.service";

@Module({
    imports: [],
    controllers: [ LambdaController ],
    providers: [ LambdaService ],
    exports: [ LambdaService ],
})
export class LambdaModule {}
