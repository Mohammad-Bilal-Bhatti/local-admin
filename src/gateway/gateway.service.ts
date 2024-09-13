import { Injectable } from "@nestjs/common";
import {
    APIGatewayClient,
} from '@aws-sdk/client-api-gateway';
import { ConfigService } from "@nestjs/config";
@Injectable()
export class GatewayService {
    private readonly client: APIGatewayClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new APIGatewayClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }
    
}
