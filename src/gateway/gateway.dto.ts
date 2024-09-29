
import { IntegrationType } from '@aws-sdk/client-api-gateway';
export class CreateRestApiDto {
    name: string;
    description: string;
}

export class CreateResourceDto {
    restApiId: string;
    parentId: string;
    pathPart: string;
}

export class CreateMethodDto {
    restApiId: string;
    resourceId: string;
    httpMethod: string;
    authorizationType: string;
}

export class CreateStageDto {
    restApiId: string;
    deploymentId: string;
    stageName: string;
    description: string;
}

export class CreateDeploymentDto {
    restApiId: string;
    description: string;
}

export class CreateIntegrationDto {
    restApiId: string;
    resourceId: string;
    httpMethod: string;
    integrationType: IntegrationType;
    integrationHttpMethod: string;
    uri: string;
    passthroughBehavior: string;
}

export { IntegrationType } from '@aws-sdk/client-api-gateway';
