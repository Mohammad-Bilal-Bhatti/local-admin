
export { IntegrationType } from '@aws-sdk/client-api-gateway';

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
