import { Injectable } from "@nestjs/common";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { 
    KinesisClient 
} from "@aws-sdk/client-kinesis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KinesisService implements ConfigurableService {

    private client: KinesisClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new KinesisClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new KinesisClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

}
