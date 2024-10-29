import { Injectable } from "@nestjs/common";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigService } from "@nestjs/config";
import { 
    SFNClient, 
    ListActivitiesCommand, 
    ListActivitiesCommandOutput 
} from "@aws-sdk/client-sfn";

@Injectable()
export class SfnService implements ConfigurableService {

    private client: SFNClient;

    constructor(private readonly configService: ConfigService) {
        this.client = new SFNClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new SFNClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

    async listActivities(): Promise<ListActivitiesCommandOutput> {
        const command = new ListActivitiesCommand({});
        const result = await this.client.send(command);
        return result;

    }

}
