import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    APIGatewayClient,
    CreateRestApiCommand,
    CreateRestApiCommandOutput,
    GetResourcesCommand,
    GetResourcesCommandOutput,
    CreateResourceCommand,
    CreateResourceCommandOutput,
    PutMethodCommand,
    PutMethodCommandOutput,
    PutIntegrationCommand,
    PutIntegrationCommandOutput,
    CreateDeploymentCommand,
    CreateDeploymentCommandOutput,
    GetRestApisCommand,
    GetRestApisCommandOutput,
    DeleteRestApiCommand,
    DeleteRestApiCommandOutput,
    GetRestApiCommand,
    GetRestApiCommandOutput,
} from '@aws-sdk/client-api-gateway';
import { IntegrationType } from './gateway.dto';

@Injectable()
export class GatewayService {
    private readonly client: APIGatewayClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new APIGatewayClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }

    async getRestApis(): Promise<GetRestApisCommandOutput> {
        const command = new GetRestApisCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async getRestApi(id: string): Promise<GetRestApiCommandOutput> {
        const command = new GetRestApiCommand({ restApiId: id });
        const response = await this.client.send(command);
        return response;
    }

    async createRestApi(name: string, description: string): Promise<CreateRestApiCommandOutput> {
        const command = new CreateRestApiCommand({ name: name, description: description });
        const response = await this.client.send(command);
        return response;
    }

    async deleteRestApi(id: string): Promise<DeleteRestApiCommandOutput> {
        const command = new DeleteRestApiCommand({ restApiId: id });
        const response = await this.client.send(command);
        return response;
    }

    async getResources(restApiId: string): Promise<GetResourcesCommandOutput> {
        const command = new GetResourcesCommand({ restApiId: restApiId });
        const response = await this.client.send(command);
        return response;
    }

    async createResource(restApiId: string, parentId: string, pathPart: string): Promise<CreateResourceCommandOutput> {
        const command = new CreateResourceCommand({ restApiId, parentId, pathPart });
        const response = await this.client.send(command);
        return response;
    }

    async putMethod(restApiId: string, resourceId: string, httpMethod: string, authorizationType: string): Promise<PutMethodCommandOutput> {
        const command = new PutMethodCommand({ 
            restApiId,
            resourceId,
            httpMethod,
            authorizationType
        });
        const response = await this.client.send(command);
        return response;
    }

    async putIntegration(restApiId: string, resourceId: string, httpMethod: string, type: IntegrationType, integrationHttpMethod: string, uri: string, passthroughBehavior: string): Promise<PutIntegrationCommandOutput> {
        const command = new PutIntegrationCommand({ 
            restApiId, 
            resourceId, 
            httpMethod, 
            type, 
            integrationHttpMethod, 
            uri, 
            passthroughBehavior, 
        });
        const response = await this.client.send(command);
        return response;
    }

    async createDeployment(restApiId: string, stageName: string): Promise<CreateDeploymentCommandOutput> {
        const command = new CreateDeploymentCommand({ restApiId, stageName });
        const response = await this.client.send(command);
        return response;
    }

    
}