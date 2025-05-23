import { Injectable, Logger } from "@nestjs/common";

import {
    ListTopicsCommand,
    ListTopicsCommandOutput,
    CreateTopicCommand,
    DeleteTopicCommand,
    GetTopicAttributesCommand,
    SNSClient,
    CreateTopicCommandOutput,
    DeleteTopicCommandOutput,
    GetTopicAttributesCommandOutput,
    PublishCommand,
    PublishCommandOutput,
    SubscribeCommand,
    SubscribeCommandOutput,
    ListSubscriptionsCommand,
    ListSubscriptionsCommandOutput,
    UnsubscribeCommand,
    UnsubscribeCommandOutput,
    ConfirmSubscriptionCommand,
    ConfirmSubscriptionCommandOutput,
    CreatePlatformEndpointCommand,
    CreatePlatformEndpointCommandOutput,
    CreatePlatformApplicationCommand,
    CreatePlatformApplicationCommandOutput,
} from '@aws-sdk/client-sns';
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { TagInput } from "src/sns/sns.input.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigureInput } from "src/app.dto";

@Injectable()
export class SnsService implements ConfigurableService {

    private client: SNSClient;
    private logger: Logger;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.client = new SNSClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
        this.logger = new Logger(SnsService.name);
    }

    configure(configuration: ConfigureInput): void {
        this.client = new SNSClient({
            endpoint: configuration.endpoint,
            region: configuration.region
        });
    }

    async getTopicsList(): Promise<ListTopicsCommandOutput> {
        const command = new ListTopicsCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async createTopic(name: string, fifoTopic: string, contentBasedDeduplication: string, tags: TagInput[]): Promise<CreateTopicCommandOutput> {
        const command = new CreateTopicCommand({
            Name: name,
            Tags: tags,
            Attributes: {
                FifoTopic: fifoTopic,
                ContentBasedDeduplication: contentBasedDeduplication
            }
        });

        const response = await this.client.send(command);
        return response;
    }

    async removeTopic(arn: string): Promise<DeleteTopicCommandOutput> {
        const command = new DeleteTopicCommand({ TopicArn: arn });
        const response = await this.client.send(command);
        return response;
    }

    async getTopicDetails(arn: string): Promise<GetTopicAttributesCommandOutput> {
        const command = new GetTopicAttributesCommand({
            TopicArn: arn,
        });

        const response = await this.client.send(command);
        return response;
    }
    
    async listSubscriptions(): Promise<ListSubscriptionsCommandOutput> {
        const command = new ListSubscriptionsCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async publishMessage(topicArn: string, message: string): Promise<PublishCommandOutput> {
        const command = new PublishCommand({
            TopicArn: topicArn,
            Message: message,
        });

        const response = await this.client.send(command);
        return response;
    }

    async subscribeTopic(topicArn: string, protocol: string, endpoint: string): Promise<SubscribeCommandOutput> {

        const command = new SubscribeCommand({
            TopicArn: topicArn,
            Protocol: protocol,
            Endpoint: endpoint,
        });
        const response = await this.client.send(command);
        return response;
    }

    async unsubscribeTopic(subscriptionArn: string): Promise<UnsubscribeCommandOutput> {
        const command = new UnsubscribeCommand({
            SubscriptionArn: subscriptionArn
        });

        const response = await this.client.send(command);
        return response;
    }

    async confirmSubscription(topicArn: string, token: string): Promise<ConfirmSubscriptionCommandOutput> {
        const command = new ConfirmSubscriptionCommand({
            Token: token,
            TopicArn: topicArn,
        });
        const response = await this.client.send(command);
        return response;
    }

    async lookupSubscriptionToken(topicArn: string): Promise<string> {
        try {

            const baseURL = this.configService.get<string>('localstack.endpoint');
            const response = await this.httpService.axiosRef.get<{subscription_token: string, subscription_arn: string}>(`${baseURL}/_aws/sns/subscription-tokens/${topicArn}`);
            return response.data.subscription_token;

        } catch (error){
            this.logger.error('Error occured with looking up subscription token:', error);
            return null
        }
    }

    async createPlatformApplication(name: string, platform: string): Promise<CreatePlatformApplicationCommandOutput> {
        const command = new CreatePlatformApplicationCommand({
            Name: name,
            Platform: platform,
            Attributes: {

            }
        });
        const response = await this.client.send(command);
        return response;
    }

    async createPlatformEndpoint(platformApplicationArn: string, token: string): Promise<CreatePlatformEndpointCommandOutput> {
        const command = new CreatePlatformEndpointCommand({
            PlatformApplicationArn: platformApplicationArn,
            Token: token,
        });
        const response = await this.client.send(command);
        return response;
    }

}

