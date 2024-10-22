import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { 
    Route53Client,
    CreateHostedZoneCommand,
    CreateHostedZoneCommandOutput,
    ListHostedZonesCommand,
    ListHostedZonesCommandOutput,
    DeleteHostedZoneCommand,
    DeleteHostedZoneCommandOutput,
    ListResourceRecordSetsCommand,
    ListResourceRecordSetsCommandOutput,
    ChangeResourceRecordSetsCommand,
    ChangeResourceRecordSetsCommandOutput,
    ChangeAction,
    RRType,
} from "@aws-sdk/client-route-53";

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

    async createHostedZone(name: string, callerReference: string): Promise<CreateHostedZoneCommandOutput> {
        const command = new CreateHostedZoneCommand({
            Name: name,
            CallerReference: callerReference,
        });
        const result = await this.client.send(command);
        return result;
    }

    async listHostedZones(): Promise<ListHostedZonesCommandOutput> {
        const command = new ListHostedZonesCommand({});
        const result = await this.client.send(command);
        return result;
    }

    async deleteHostedZone(id: string): Promise<DeleteHostedZoneCommandOutput> {
        const command = new DeleteHostedZoneCommand({
            Id: id,
        });
        const result = await this.client.send(command);
        return result;
    }

    async getRecordsSet(hostedZoneId: string): Promise<ListResourceRecordSetsCommandOutput> {
        const command = new ListResourceRecordSetsCommand({
            HostedZoneId: hostedZoneId
        });
        const result = await this.client.send(command);
        return result;
    }

    async changeRecordSet(hostedZoneId: string, action: ChangeAction, recordName: string, recordType: RRType, recordValue: string) {
        const command = new ChangeResourceRecordSetsCommand({
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: action,
                        ResourceRecordSet: {
                            Name: recordName,
                            Type: recordType,
                            ResourceRecords: [
                                { Value: recordValue },
                            ]                
                        }
                    }
                ]
            }
        });
        const result = await this.client.send(command);
        return result;
    }

}
