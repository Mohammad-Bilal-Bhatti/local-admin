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
} from '@aws-sdk/client-eventbridge';
import { ConfigService } from "@nestjs/config";
import { TargetInput } from "src/dtos/event-bridge.dto";

@Injectable()
export class EventBridgeService {

    private client: EventBridgeClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new EventBridgeClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        })
    }

    async getRulesList(): Promise<ListRulesCommandOutput> {
        const command = new ListRulesCommand({});
        const response = await this.client.send(command);
        return response;            
    }

    async createEventRule(name: string, description: string, scheduleExpression: string): Promise<PutRuleCommandOutput> {
        const command = new PutRuleCommand({
            Name: name,
            Description: description,
            ScheduleExpression: scheduleExpression,
        });

        const response = await this.client.send(command);
        return response;
    }

    async deleteRule(name: string): Promise<DeleteRuleCommandOutput> {
        const command = new DeleteRuleCommand({
            Name: name,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createTarget(rule: string, targets: TargetInput[]): Promise<PutTargetsCommandOutput> {
        const command = new PutTargetsCommand({
            Rule: rule,
            Targets: targets,
        });
        const response = await this.client.send(command);
        return response;
    }

    async describeRule(name: string): Promise<DescribeRuleCommandOutput> {
        const command = new DescribeRuleCommand({
            Name: name,
        });
        const response = await this.client.send(command);
        return response;
    }

    async listTargets(rule: string): Promise<ListTargetsByRuleCommandOutput> {
        const command = new ListTargetsByRuleCommand({ Rule: rule });
        const response = await this.client.send(command);
        return response;
    }

    async deleteTarget(rule: string, id: string): Promise<RemoveTargetsCommandOutput> {
        const command = new RemoveTargetsCommand({ Ids: [id], Rule: rule });
        const response = await this.client.send(command);
        return response;
    }

}
