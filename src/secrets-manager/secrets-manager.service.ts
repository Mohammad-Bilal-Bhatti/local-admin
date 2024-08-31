import { Injectable } from "@nestjs/common";

import {
    ListSecretsCommand,
    ListSecretsCommandOutput,
    GetSecretValueCommand,
    GetSecretValueCommandOutput,
    SecretsManagerClient,
    CreateSecretCommand,
    CreateSecretCommandOutput,
    DeleteSecretCommand,
    DeleteSecretCommandOutput,
} from '@aws-sdk/client-secrets-manager';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SecretsManagerService {

    private client: SecretsManagerClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new SecretsManagerClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        })
    }

    async getSecretsList(limit: number, token: string): Promise<ListSecretsCommandOutput> {
        const command = new ListSecretsCommand({ 
            MaxResults: limit,
            NextToken: token,
        });
        const response = await this.client.send(command);
        return response;
    }

    async getSecretDetails(secretId: string): Promise<GetSecretValueCommandOutput> {
        const command = new GetSecretValueCommand({ SecretId: secretId });
        const response = await this.client.send(command);
        return response;
    }

    async createSecret(name: string, description: string, secret: string): Promise<CreateSecretCommandOutput> {
        const command = new CreateSecretCommand({ 
            Name: name,
            Description: description,
            SecretString: secret,
        });
        const response = await this.client.send(command);
        return response;
    }

    async deleteSecret(secretId: string): Promise<DeleteSecretCommandOutput> {
        const command = new DeleteSecretCommand({ SecretId: secretId });
        const response = this.client.send(command);
        return response;
    }

}
