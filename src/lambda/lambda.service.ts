import { Injectable } from "@nestjs/common";
import { 
    Runtime,
    LambdaClient, 
    ListFunctionsCommand,
    ListFunctionsCommandOutput,
    CreateFunctionCommand,
    DeleteFunctionCommand,
    DeleteFunctionCommandOutput,
    GetFunctionCommand,
    GetFunctionCommandOutput,
    InvokeCommand,
    InvokeCommandOutput,
    CreateAliasCommand,
    CreateAliasCommandOutput,
    DeleteAliasCommand,
    DeleteAliasCommandOutput,
    ListAliasesCommand,
    ListAliasesCommandOutput,
    UpdateFunctionCodeCommand,
    UpdateFunctionCodeCommandOutput,
    PublishVersionCommand,
    PublishVersionCommandOutput,
    GetEventSourceMappingCommand,
    GetEventSourceMappingCommandOutput,
    CreateEventSourceMappingCommand,
    CreateEventSourceMappingCommandOutput,
    ListEventSourceMappingsCommand,
    ListEventSourceMappingsCommandOutput,
    DeleteEventSourceMappingCommand,
    DeleteEventSourceMappingCommandOutput,
    CreateFunctionUrlConfigCommand,
    CreateFunctionUrlConfigCommandOutput,
    ListFunctionUrlConfigsCommand,
    ListFunctionUrlConfigsCommandOutput,
    DeleteFunctionUrlConfigCommand,
    DeleteFunctionUrlConfigCommandOutput,
    FunctionUrlAuthType,
    InvokeMode,
    EventSourcePosition
} from "@aws-sdk/client-lambda";
import { ConfigService } from "@nestjs/config";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigureInput } from "src/app.dto";


@Injectable()
export class LambdaService implements ConfigurableService {
    private client: LambdaClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new LambdaClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new LambdaClient({
            endpoint: configuration.endpoint,
            region: configuration.region
        });
    }

    async listLabmdaFunctions(): Promise<ListFunctionsCommandOutput> {
        const command = new ListFunctionsCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async createLambdaFunction(name: string, description: string, role: string, s3Bucket: string, s3Key: string, runtime: Runtime, handler: string) {
        const command = new CreateFunctionCommand({ 
            FunctionName: name, 
            Code: { S3Bucket: s3Bucket, S3Key: s3Key }, 
            Role: role, Description: description,
            Runtime: runtime,
            Handler: handler,
        });
        const response = await this.client.send(command);
        return response;
    }

    async removeFunction(name: string): Promise<DeleteFunctionCommandOutput> {
        const command = new DeleteFunctionCommand({ FunctionName: name });
        const response = await this.client.send(command);
        return response;
    }

    async getLambdaFunction(name: string): Promise<GetFunctionCommandOutput> {
        const command = new GetFunctionCommand({ FunctionName: name });
        const response = this.client.send(command);
        return response;
    }

    async invokeLambdaFunction(name: string, payload: string): Promise<InvokeCommandOutput> {
        const command = new InvokeCommand({ 
            FunctionName: name, 
            Payload: payload,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createAlias(name: string, functionName: string, functionVersion: string): Promise<CreateAliasCommandOutput> {
        const command = new CreateAliasCommand({ Name: name, FunctionName: functionName, FunctionVersion: functionVersion });
        const response = await this.client.send(command);
        return response;
    }

    async deleteAlias(name: string, functionName: string): Promise<DeleteAliasCommandOutput> {
        const command = new DeleteAliasCommand({ Name: name, FunctionName: functionName });
        const response = await this.client.send(command);
        return response; 
    }

    async listAliases(functionName: string): Promise<ListAliasesCommandOutput> {
        const command = new ListAliasesCommand({ FunctionName: functionName });
        const response = await this.client.send(command);
        return response;
    }

    async updateFunctionCode(functionName: string, bucket: string, key: string): Promise<UpdateFunctionCodeCommandOutput> {
        const command = new UpdateFunctionCodeCommand({
            FunctionName: functionName,
            S3Bucket: bucket,
            S3Key: key,
        });
        const response = await this.client.send(command);
        return response;
    }

    async publishVersion(functionName: string): Promise<PublishVersionCommandOutput> {
        const command = new PublishVersionCommand({
            FunctionName: functionName,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createEventSourceMapping(
        functionName: string, 
        eventSourceArn: string,
        batchSize: number, 
        startingPosition: EventSourcePosition, 
    ): Promise<CreateEventSourceMappingCommandOutput> {
        const command = new CreateEventSourceMappingCommand({
            FunctionName: functionName,
            BatchSize: batchSize,
            StartingPosition: startingPosition,
            EventSourceArn: eventSourceArn,
        });
        const response = await this.client.send(command);
        return response;
    }

    async deleteEventSourceMapping(uuid: string): Promise<DeleteEventSourceMappingCommandOutput> {
        const command = new DeleteEventSourceMappingCommand({ UUID: uuid });
        const response = await this.client.send(command);
        return response;
    }

    async listEventSourceMapping(functionName?: string): Promise<ListEventSourceMappingsCommandOutput> {
        const command = new ListEventSourceMappingsCommand({
            FunctionName: functionName,
        });
        const response = await this.client.send(command);
        return response;
    }

    async getEventSourceMapping(uuid: string): Promise<GetEventSourceMappingCommandOutput> {
        const command = new GetEventSourceMappingCommand({ UUID: uuid });
        const response = await this.client.send(command);
        return response;
    }

    async createFunctionUrl(functionName: string, authType: FunctionUrlAuthType, invokeMode: InvokeMode): Promise<CreateFunctionUrlConfigCommandOutput> {
        const command = new CreateFunctionUrlConfigCommand({ 
            FunctionName: functionName,  
            AuthType: authType,
            InvokeMode: invokeMode,
        });
        const response = await this.client.send(command);
        return response;
    }

    async listFunctionUrls(functionName: string): Promise<ListFunctionUrlConfigsCommandOutput> { 
        const command = new ListFunctionUrlConfigsCommand({FunctionName: functionName});
        const response = await this.client.send(command);
        return response;
    }

    async deleteFunctionUrl(functionName: string): Promise<DeleteFunctionUrlConfigCommandOutput> {
        const command = new DeleteFunctionUrlConfigCommand({ 
            FunctionName: functionName,
        });
        const response = await this.client.send(command);
        return response;
    }

}
