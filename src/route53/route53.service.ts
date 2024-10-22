import { Route53Client } from "@aws-sdk/client-route-53";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";

@Injectable()
export class Route53Service implements ConfigurableService {

    private client: Route53Client; 
    constructor(private readonly configService: ConfigService) {
        this.client = new Route53Client({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new Route53Client({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

}
