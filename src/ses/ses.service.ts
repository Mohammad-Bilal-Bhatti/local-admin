import { SESClient } from "@aws-sdk/client-ses";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";

@Injectable()
export class SesService implements ConfigurableService {

    private client: SESClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new SESClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new SESClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

}
