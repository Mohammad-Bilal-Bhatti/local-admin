import { Injectable } from "@nestjs/common";
import {
    SSMClient,
    GetParameterCommand,
    GetParameterCommandOutput,
    DescribeParametersCommand,
    DescribeParametersCommandOutput,
    PutParameterCommand,
    PutParameterCommandOutput,
    DeleteParameterCommand,
    DeleteParameterCommandOutput,
    GetParameterHistoryCommand,
    GetParameterHistoryCommandOutput,

} from '@aws-sdk/client-ssm';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SsmService {

    private client: SSMClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new SSMClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
    }

    async getParameter(name: string): Promise<GetParameterCommandOutput> {
        const command = new GetParameterCommand({
            Name: name,
            WithDecryption: true,
        });

        const response = await this.client.send(command);
        return response;
    }

    async getParameters(): Promise<DescribeParametersCommandOutput> {
        const command = new DescribeParametersCommand();
        const response = await this.client.send(command);
        return response;
    }

    async putParameter(name: string, value: string, overwrite?: string): Promise<PutParameterCommandOutput> {
        const command = new PutParameterCommand({
            Name: name,
            Value: value,
            Type: 'String',
            ...( overwrite && { Overwrite: true }),
        });

        const response = await this.client.send(command);
        return response;
    }

    async removeParameter(name: string): Promise<DeleteParameterCommandOutput> {
        const command = new DeleteParameterCommand({ Name: name });
        const response = await this.client.send(command);
        return response;
    }

    async getParameterHistory(name: string): Promise<GetParameterHistoryCommandOutput> {
        const command = new GetParameterHistoryCommand({Name: name});
        const response = await this.client.send(command);
        return response;
    }

}
