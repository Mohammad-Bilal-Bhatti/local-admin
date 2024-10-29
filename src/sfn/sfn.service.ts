import { Injectable } from "@nestjs/common";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigService } from "@nestjs/config";
import { 
    SFNClient, 
    ListStateMachinesCommand, 
    ListStateMachinesCommandOutput,
    DeleteStateMachineCommand,
    DeleteStateMachineCommandOutput,
    StartExecutionCommand,
    StartExecutionCommandOutput,
    ListExecutionsCommand,
    ListExecutionsCommandOutput,
    DescribeStateMachineCommand,
    DescribeStateMachineCommandOutput,
    CreateStateMachineCommand,
    CreateStateMachineCommandOutput,
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

    async listStateMachines(): Promise<ListStateMachinesCommandOutput> {
        const command = new ListStateMachinesCommand({});
        const result = await this.client.send(command);
        return result;
    }

    async deleteStateMachine(stateMachineArn: string): Promise<DeleteStateMachineCommandOutput> {
        const command = new DeleteStateMachineCommand({
            stateMachineArn: stateMachineArn,
        });
        const result = await this.client.send(command);
        return result;
    }

    async startExecution(stateMachineArn: string, input: string): Promise<StartExecutionCommandOutput> {
        const command = new StartExecutionCommand({
            stateMachineArn: stateMachineArn,
            input: input,
        });
        const result = await this.client.send(command);
        return result;
    }

    async listExecutions(stateMachineArn: string): Promise<ListExecutionsCommandOutput> {
        const command = new ListExecutionsCommand({
            stateMachineArn: stateMachineArn,
        });
        const result = await this.client.send(command);
        return result;
    }

    async describeStateMachine(stateMachineArn: string): Promise<DescribeStateMachineCommandOutput> {
        const command = new DescribeStateMachineCommand({
            stateMachineArn: stateMachineArn,
        });
        const result = await this.client.send(command);
        return result;
    }

    async createStateMachine(name: string, definition: string, roleArn: string): Promise<CreateStateMachineCommandOutput> {
        const command = new CreateStateMachineCommand({
            name: name,
            definition: definition,
            roleArn: roleArn
        });
        const result = await this.client.send(command);
        return result;
    }

}
