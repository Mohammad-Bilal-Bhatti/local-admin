import { Injectable } from "@nestjs/common";
import {
    EventBridgeClient,
    PutRuleCommand,
    PutRuleCommandOutput,
    ListRulesCommand,
    ListRulesCommandOutput,
    DeleteRuleCommand,
    DeleteRuleCommandOutput,
    PutTargetsCommand,
    PutTargetsCommandOutput,
    DescribeRuleCommand,
    DescribeRuleCommandOutput,
    ListTargetsByRuleCommand,
    ListTargetsByRuleCommandOutput,
    RemoveTargetsCommand,
    RemoveTargetsCommandOutput,
    CreateEventBusCommand,
    CreateEventBusCommandOutput,
    ListEventBusesCommand,
    ListEventBusesCommandOutput,
    DeleteEventBusCommand,
    DeleteEventBusCommandOutput,
    ListArchivesCommand,
    ListArchivesCommandOutput,
    CreateArchiveCommand,
    CreateArchiveCommandOutput,
    DeleteArchiveCommand,
    DeleteArchiveCommandOutput,
    PutEventsCommand,
    PutEventsCommandOutput,
    DescribeArchiveCommand,
    DescribeArchiveCommandOutput,
    StartReplayCommand,
    StartReplayCommandOutput,
} from '@aws-sdk/client-eventbridge';
import { ConfigService } from "@nestjs/config";
import { TargetInput } from "src/event-bridge/event-bridge.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigureInput } from "src/app.dto";

@Injectable()
export class EventBridgeService implements ConfigurableService {

    private client: EventBridgeClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new EventBridgeClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        })
    }

    configure(configuration: ConfigureInput): void {
        this.client = new EventBridgeClient({
            endpoint: configuration.endpoint,
            region: configuration.region
        });
    }

    async getRulesList(eventBusName: string): Promise<ListRulesCommandOutput> {
        const command = new ListRulesCommand({ EventBusName: eventBusName });
        const response = await this.client.send(command);
        return response;            
    }

    async createEventRule(name: string, description: string, scheduleExpression?: string, eventBusname?: string, eventPattern?: string): Promise<PutRuleCommandOutput> {
        const command = new PutRuleCommand({
            Name: name,
            Description: description,
            ScheduleExpression: scheduleExpression ?? null,
            EventBusName: eventBusname ?? null,
            EventPattern: eventPattern ?? null,
        });

        const response = await this.client.send(command);
        return response;
    }

    async deleteRule(eventBusName: string, ruleName: string): Promise<DeleteRuleCommandOutput> {
        const command = new DeleteRuleCommand({
            EventBusName: eventBusName,
            Name: ruleName,
            Force: true,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createTarget(rule: string, eventBusName: string, targets: TargetInput[]): Promise<PutTargetsCommandOutput> {
        const command = new PutTargetsCommand({
            Rule: rule,
            EventBusName: eventBusName,
            Targets: targets,
        });
        const response = await this.client.send(command);
        return response;
    }

    async describeRule(name: string, eventBusName: string): Promise<DescribeRuleCommandOutput> {
        const command = new DescribeRuleCommand({
            Name: name,
            EventBusName: eventBusName
        });
        const response = await this.client.send(command);
        return response;
    }

    async listTargets(rule: string, eventBusName: string): Promise<ListTargetsByRuleCommandOutput> {
        const command = new ListTargetsByRuleCommand({ Rule: rule, EventBusName: eventBusName });
        const response = await this.client.send(command);
        return response;
    }

    async deleteTarget(eventBusName: string, rule: string, id: string): Promise<RemoveTargetsCommandOutput> {
        const command = new RemoveTargetsCommand({ Ids: [id], Rule: rule, EventBusName: eventBusName });
        const response = await this.client.send(command);
        return response;
    }

    async createEventBus(name: string, description: string): Promise<CreateEventBusCommandOutput> {
        const command = new CreateEventBusCommand({
            Name: name,
            Description: description,
        });
        const response = await this.client.send(command);
        return response;
    }

    async removeEventBus(name: string): Promise<DeleteEventBusCommandOutput> {
        const command = new DeleteEventBusCommand({ Name: name });
        const response = await this.client.send(command);
        return response;
    }

    async listEventBuses(): Promise<ListEventBusesCommandOutput> {
        const command = new ListEventBusesCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async listArchives(): Promise<ListArchivesCommandOutput> {
        const command = new ListArchivesCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async createArchive(archiveName: string, description: string, eventSourceArn: string, retentionDays: number): Promise<CreateArchiveCommandOutput> {
        const command = new CreateArchiveCommand({
            ArchiveName: archiveName,
            EventSourceArn: eventSourceArn,
            Description: description,
            RetentionDays: retentionDays,
        });
        const response = await this.client.send(command);
        return response;
    }

    async deleteArchive(archiveName: string): Promise<DeleteArchiveCommandOutput> {
        const command = new DeleteArchiveCommand({ ArchiveName: archiveName });
        const response = await this.client.send(command);
        return response;
    }

    async putEvent(eventBusName: string, source: string, detailType: string, detail: string): Promise<PutEventsCommandOutput> {
        const command = new PutEventsCommand({
            Entries: [
                {
                    EventBusName: eventBusName,
                    Source: source,
                    DetailType: detailType,
                    Detail: detail,
                }
            ]
        });
        const response = await this.client.send(command);
        return response;
    }

    async getArchiveDetails(archiveName: string): Promise<DescribeArchiveCommandOutput> {
        const command = new DescribeArchiveCommand({
            ArchiveName: archiveName,
        });
        const response = await this.client.send(command);
        return response;
    }

    async startReplay(replayName: string, sourceArn: string, destinationArn: string, startTime: Date, endTime: Date): Promise<StartReplayCommandOutput> {
        const command = new StartReplayCommand({
            ReplayName: replayName,
            EventSourceArn: sourceArn,
            Destination: { Arn: destinationArn },
            EventStartTime: startTime,
            EventEndTime: endTime,
        });
        const response = await this.client.send(command);
        return response;
    }

}
