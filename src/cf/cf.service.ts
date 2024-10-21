import { CloudFormationClient } from "@aws-sdk/client-cloudformation";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";


@Injectable()
export class CFService implements ConfigurableService {

    private client: CloudFormationClient;

    constructor(private readonly configService: ConfigService) {
       this.client = new CloudFormationClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
       });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new CloudFormationClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
       });
    }

}
