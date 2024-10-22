import { Module } from "@nestjs/common";
import { Route53Service } from "./route53.service";
import { Route53Controller } from "./route53.controller";

@Module({
    imports: [],
    controllers: [Route53Controller],
    providers: [Route53Service],
    exports: [Route53Service],
})
export class Route53Module {}
