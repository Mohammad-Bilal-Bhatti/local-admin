import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { 
    CloudFormationClient,
    ListStacksCommand,
    ListStacksCommandOutput,
    CreateStackCommand,
    CreateStackCommandOutput,
    DeleteStackCommand,
    DeleteStackCommandOutput,
    DescribeStackEventsCommand,
    DescribeStackEventsCommandOutput,
    DescribeStackResourcesCommand,
    DescribeStackResourcesCommandOutput,
    DescribeStacksCommand,
    DescribeStacksCommandOutput,
    GetTemplateCommand,
    GetTemplateCommandOutput,
} from "@aws-sdk/client-cloudformation";


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

    async listStacks(): Promise<ListStacksCommandOutput> {
        const command = new ListStacksCommand({});
        const result = await this.client.send(command);
        return result;
    }

    async createStack(stackName: string, templateBody: string): Promise<CreateStackCommandOutput> {
        const command = new CreateStackCommand({
            StackName: stackName,
            TemplateBody: templateBody,
        });
        const result = await this.client.send(command);
        return result;
    }

    async deleteStack(stackName: string): Promise<DeleteStackCommandOutput> {
        const command = new DeleteStackCommand({ StackName: stackName, DeletionMode: 'FORCE_DELETE_STACK' });
        const result = await this.client.send(command);
        return result;
    }

    async getStackEvents(stackName: string): Promise<DescribeStackEventsCommandOutput> {
        const command = new DescribeStackEventsCommand({
            StackName: stackName,
        });
        const result = await this.client.send(command);
        return result;
    }

    async getStackResources(stackName: string): Promise<DescribeStackResourcesCommandOutput> {
        const command = new DescribeStackResourcesCommand({
            StackName: stackName,
        });
        const result = await this.client.send(command);
        return result;
    }

    async getStackDetails(stackName: string): Promise<DescribeStacksCommandOutput> {
        const command = new DescribeStacksCommand({ StackName: stackName });
        const result = await this.client.send(command);
        return result;
    }
    
    async getTemplate(stackName: string): Promise<GetTemplateCommandOutput> {
        const command = new GetTemplateCommand({ StackName: stackName });
        const result = await this.client.send(command);
        return result;
    }

}
