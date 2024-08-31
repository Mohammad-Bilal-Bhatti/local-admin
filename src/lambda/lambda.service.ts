import { Injectable } from "@nestjs/common";
import { 
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
    Runtime,
} from "@aws-sdk/client-lambda";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class LambdaService {
    private readonly client: LambdaClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new LambdaClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
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

    async updateFunctionCode() {
        // const command = new UpdateFunctionCodeCommand({   });
    }

}
