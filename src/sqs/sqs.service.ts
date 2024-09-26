import { Injectable } from "@nestjs/common";
import {
    SQSClient,
    ListQueuesCommand,
    PurgeQueueCommand,
    GetQueueAttributesCommand,
    ListDeadLetterSourceQueuesCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
    CreateQueueCommand,
    DeleteQueueCommand,
    SendMessageCommand,
    SendMessageCommandOutput,
    PurgeQueueCommandOutput,
    DeleteMessageCommandOutput,
    QueueAttributeName,
    DeleteQueueCommandOutput,
    CreateQueueCommandOutput,
    ReceiveMessageCommandOutput,
    GetQueueAttributesCommandOutput,
    MessageAttributeValue,
} from "@aws-sdk/client-sqs";
import { ConfigureInput } from "../app.dto";
import { ConfigService } from "@nestjs/config";
import { MessageAttribute } from "src/sqs/sqs.input.dto";
import { ConfigurableService } from "src/shared/configurable.interface";


@Injectable()
export class SqsService implements ConfigurableService {

    private client: SQSClient;

    constructor(private readonly config: ConfigService) {
        this.client = new SQSClient({
            endpoint: this.config.get<string>('localstack.endpoint'),
            region: this.config.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput) {
        this.client = new SQSClient({
            endpoint: configuration.endpoint,
            region: configuration.region
        });
    }

    async listQueues(namePrefix: string, maxItems: number): Promise<{ data: { name: string, attributes: Partial<Record<QueueAttributeName, string>> }[], nextToken: string }> {
        let nextToken: string = null;
        const command = new ListQueuesCommand({
            QueueNamePrefix: namePrefix,
            MaxResults: maxItems,
        });

        const response = await this.client.send(command);
        const queues = response.QueueUrls;
        nextToken = response.NextToken;

        const data: { name: string, attributes: Partial<Record<QueueAttributeName, string>> }[] = [];
        if (Array.isArray(queues)) {
            for (const queue of queues) {
                const result = await this.getQueueAttributes(queue);
                data.push({ name: queue, attributes: result.Attributes });
            }
        }

        return { data: data, nextToken };
    }

    async purgeQueue(queue: string): Promise<PurgeQueueCommandOutput> {
        const command = new PurgeQueueCommand({
            QueueUrl: queue,
        });
        const response = await this.client.send(command);
        return response;
    }

    async startRedrive(dlq: string): Promise<void> {
        const listSourceDlqCommand = new ListDeadLetterSourceQueuesCommand({
            QueueUrl: dlq,
        });

        const sourceQueuesList = await this.client.send(listSourceDlqCommand);
        const sourceQueue = sourceQueuesList.queueUrls?.shift();

        /* pull message out of DQL and re-enqueue to source queue */
        const result = await this.listMessages(dlq, 10);
        if (!Array.isArray(result.Messages)) return;
        for (const message of result.Messages) {
            await this.sendMessage(sourceQueue, message.Body, message.Attributes.MessageGroupId, message.Attributes.MessageDeduplicationId);
            await this.deleteSqsMessage(dlq, message.ReceiptHandle);
        }

        return;
    }

    async getQueueAttributes(queue: string): Promise<GetQueueAttributesCommandOutput> {
        const command = new GetQueueAttributesCommand({
            QueueUrl: queue,
            AttributeNames: ['All']
        });
        const response = await this.client.send(command);
        return response;
    }

    async listMessages(queue: string, limit: number): Promise<ReceiveMessageCommandOutput> {
        const command = new ReceiveMessageCommand({
            QueueUrl: queue,
            MaxNumberOfMessages: limit, /* Note: SQS doesnot know and support pagination. */
            AttributeNames: ['All'],
            MessageAttributeNames: ['All'],
            VisibilityTimeout: 0,
        });

        const response = await this.client.send(command);
        return response;
    }

    async deleteSqsMessage(QueueUrl: string, ReceiptHandle: string): Promise<DeleteMessageCommandOutput> {
        const command = new DeleteMessageCommand({
            QueueUrl,
            ReceiptHandle,
        });

        const response = await this.client.send(command);
        return response;
    }

    async createQueue(QueueName: string, FifoQueue: string): Promise<CreateQueueCommandOutput> {
        const command = new CreateQueueCommand({
            QueueName: QueueName,
            Attributes: {
                FifoQueue: FifoQueue ? 'true' : undefined,
            }
        });

        const response = await this.client.send(command);
        return response;
    }

    async deleteQueue(QueueUrl: string): Promise<DeleteQueueCommandOutput> {

        const command = new DeleteQueueCommand({
            QueueUrl: QueueUrl
        });

        const response = await this.client.send(command);
        return response

    }

    async sendMessage(QueueUrl: string, MessageBody: string, MessageGroupId?: string, MessageDeduplicationId?: string, messageAttributes?: MessageAttribute[]): Promise<SendMessageCommandOutput> {
        const MessageAttributes: Record<string, MessageAttributeValue> = messageAttributes?.reduce((messageAttribute, attribute) => {
            messageAttribute[attribute.name] = {
                StringValue: attribute.value,
                DataType: 'String' /* supporting string data type for now. */
            };
            return messageAttribute;
        }, {});

        const isFifoQueue = QueueUrl.endsWith('.fifo');
        const command = new SendMessageCommand({
            QueueUrl: QueueUrl,
            MessageBody: MessageBody,
            MessageGroupId: isFifoQueue ? MessageGroupId : null,
            MessageDeduplicationId: isFifoQueue ? MessageDeduplicationId : null,
            MessageAttributes: MessageAttributes,
        });

        const response = await this.client.send(command);
        return response

    }

}
