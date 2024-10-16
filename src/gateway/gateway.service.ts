import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    QuotaPeriodType,
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
    GetDeploymentsCommand,
    GetDeploymentsCommandOutput,
    CreateDeploymentCommand,
    CreateDeploymentCommandOutput,
    GetRestApisCommand,
    GetRestApisCommandOutput,
    DeleteRestApiCommand,
    DeleteRestApiCommandOutput,
    GetRestApiCommand,
    GetRestApiCommandOutput,
    CreateStageCommand,
    CreateStageCommandOutput,
    GetStagesCommand,
    GetStagesCommandOutput,
    GetUsagePlanCommand,
    GetUsagePlanCommandOutput,
    CreateUsagePlanCommand,
    CreateUsagePlanCommandOutput,
    DeleteUsagePlanCommand,
    DeleteUsagePlanCommandOutput,
    GetUsagePlansCommand,
    GetUsagePlansCommandOutput,
    CreateUsagePlanKeyCommand,
    CreateUsagePlanKeyCommandOutput,
    DeleteUsagePlanKeyCommand,
    DeleteUsagePlanKeyCommandOutput,
    GetUsagePlanKeysCommand,
    GetUsagePlanKeysCommandOutput,
} from '@aws-sdk/client-api-gateway';
import { IntegrationType } from './gateway.dto';
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigureInput } from "src/app.dto";

@Injectable()
export class GatewayService implements ConfigurableService {
    private client: APIGatewayClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new APIGatewayClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }
    
    configure(configuration: ConfigureInput): void {
        this.client = new APIGatewayClient({
            endpoint: configuration.endpoint,
            region: configuration.region
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

    async createDeployment(restApiId: string, description: string): Promise<CreateDeploymentCommandOutput> {
        const command = new CreateDeploymentCommand({
            restApiId: restApiId,
            description: description,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createStage(stageName: string, description: string, deploymentId: string, restapiId: string): Promise<CreateStageCommandOutput> {
        const command = new CreateStageCommand({ 
            stageName: stageName,
            description: description,
            restApiId: restapiId,
            deploymentId: deploymentId,
        });
        const response = await this.client.send(command);
        return response;
    }

    async getStages(restApiId: string): Promise<GetStagesCommandOutput> {
        const command = new GetStagesCommand({ restApiId: restApiId });
        const response = await this.client.send(command);
        return response;
    }

    async listDeployments(restApiId: string): Promise<GetDeploymentsCommandOutput> {
        const command = new GetDeploymentsCommand({ restApiId });
        const response = await this.client.send(command);
        return response;
    }

    async getUsagePlans(): Promise<GetUsagePlansCommandOutput> {
        const command = new GetUsagePlansCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async createUsagePlan(name: string, description: string, quotaPeriod: QuotaPeriodType, quotaLimit: number): Promise<CreateUsagePlanCommandOutput> {
        const command = new CreateUsagePlanCommand({
            name: name,
            description: description,
            quota: {
                period: quotaPeriod,
                limit: quotaLimit,
            },
        });
        const response = await this.client.send(command);
        return response;
    }

    async deleteUsagePlan(usagePlanId: string): Promise<DeleteUsagePlanCommandOutput> {
        const command = new DeleteUsagePlanCommand({ usagePlanId: usagePlanId });
        const response = await this.client.send(command);
        return response;
    }

    async getUsagePlan(usagePlanId: string): Promise<GetUsagePlanCommandOutput> {
        const command = new GetUsagePlanCommand({ usagePlanId });
        const response = await this.client.send(command);
        return response;
    }

    async getUsagePlanKeys(usagePlanId: string): Promise<GetUsagePlanKeysCommandOutput> {
        const command = new GetUsagePlanKeysCommand({
            usagePlanId: usagePlanId,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createUsagePlanKey(usagePlanId: string, keyId: string, keyType: string): Promise<CreateUsagePlanKeyCommandOutput> {
        const command = new CreateUsagePlanKeyCommand({
            usagePlanId: usagePlanId,
            keyId: keyId,
            keyType: keyType,
        });
        const response = await this.client.send(command);
        return response;
    }

    async deleteUsagePlanKey(usagePlanId: string, keyId: string): Promise<DeleteUsagePlanKeyCommandOutput> {
        const command = new DeleteUsagePlanKeyCommand({
            usagePlanId: usagePlanId,
            keyId: keyId,
        });
        const response = await this.client.send(command);
        return response;
    }

}
