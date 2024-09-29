import { Injectable } from "@nestjs/common";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigService } from "@nestjs/config";
import { 
    KinesisClient,
    CreateStreamCommand,
    CreateStreamCommandOutput,
    ListStreamsCommand,
    ListStreamsCommandOutput,
    DescribeStreamCommand,
    DescribeStreamCommandOutput,
    DeleteStreamCommand,
    DeleteStreamCommandOutput,
    PutRecordCommand,
    PutRecordCommandOutput,
} from "@aws-sdk/client-kinesis";

@Injectable()
export class KinesisService implements ConfigurableService {

    private client: KinesisClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new KinesisClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new KinesisClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

    async createStream(streamName: string, shardCount: number): Promise<CreateStreamCommandOutput> {
        const command = new CreateStreamCommand({ StreamName: streamName, ShardCount: shardCount });
        const response = this.client.send(command);
        return response;
    }

    async listStreams(): Promise<ListStreamsCommandOutput> {
        const command = new ListStreamsCommand({});
        const response = this.client.send(command);
        return response;
    }

    async describeStream(streamName: string): Promise<DescribeStreamCommandOutput> {
        const command = new DescribeStreamCommand({ StreamName: streamName });
        const response = this.client.send(command);
        return response;
    }

    async deleteStream(streamName: string): Promise<DeleteStreamCommandOutput> {
        const command = new DeleteStreamCommand({ StreamName: streamName });
        const response = await this.client.send(command);
        return response;
    }

    async putRecord(streamName: string, partitionKey: string, data: Uint8Array): Promise<PutRecordCommandOutput> {
        const command = new PutRecordCommand({ 
            StreamName: streamName,
            PartitionKey: partitionKey,
            Data: data, 
        });
        const response = await this.client.send(command);
        return response;
    }

}
