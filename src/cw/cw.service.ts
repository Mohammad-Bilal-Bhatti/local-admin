import { Injectable } from "@nestjs/common";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { 
    CloudWatchClient,
} from "@aws-sdk/client-cloudwatch";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CWService implements ConfigurableService {

    private client: CloudWatchClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new CloudWatchClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.endpoint'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new CloudWatchClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

}
