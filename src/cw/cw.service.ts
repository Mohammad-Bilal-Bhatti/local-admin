import { Injectable } from "@nestjs/common";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigService } from "@nestjs/config";
import { 
    CloudWatchClient,
    ListMetricsCommand,
    DescribeAlarmsCommand,
    ListMetricsCommandOutput,
    DescribeAlarmsCommandOutput,
    PutMetricAlarmCommand,
    PutMetricAlarmCommandOutput,
    PutMetricDataCommand,
    PutMetricDataCommandOutput,
} from "@aws-sdk/client-cloudwatch";
import { 
    CloudWatchLogsClient,
    CreateLogGroupCommand,
    CreateLogGroupCommandOutput,
    CreateLogStreamCommand,
    CreateLogStreamCommandOutput,
    DescribeLogGroupsCommand,
    DescribeLogGroupsCommandOutput,
    DescribeLogStreamsCommand,
    DescribeLogStreamsCommandOutput,
    DeleteLogGroupCommand,
    DeleteLogGroupCommandOutput,
    DeleteLogStreamCommand,
    DeleteLogStreamCommandOutput,
    GetLogEventsCommand,
    GetLogEventsCommandOutput,
    PutLogEventsCommand,
    PutLogEventsCommandOutput,
    LogGroupClass,
} from "@aws-sdk/client-cloudwatch-logs";

@Injectable()
export class CWService implements ConfigurableService {

    private client: CloudWatchClient;
    private logClient: CloudWatchLogsClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new CloudWatchClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
        this.logClient = new CloudWatchLogsClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new CloudWatchClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
        this.logClient = new CloudWatchLogsClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

    async listMetrics(): Promise<ListMetricsCommandOutput> {
        const command = new ListMetricsCommand({});
        const result = await this.client.send(command);
        return result;
    }

    async listAlarms(): Promise<DescribeAlarmsCommandOutput> {
        const command = new DescribeAlarmsCommand({});
        const result = await this.client.send(command);
        return result;
    }

    async createMetricAlarm(namespace: string, alarmName: string, metricName: string): Promise<PutMetricAlarmCommandOutput> {
        const command = new PutMetricAlarmCommand({
            AlarmName: alarmName,
            MetricName: metricName,
            ComparisonOperator: 'GreaterThanOrEqualToThreshold',
            EvaluationPeriods: 1,
            Period: 30,
            Statistic: 'Minimum',
            Namespace: namespace
        });
        const result = await this.client.send(command);
        return result;
    }

    async putMetricData(namespace: string, metricName: string, value: number): Promise<PutMetricDataCommandOutput> {
        const command = new PutMetricDataCommand({
            Namespace: namespace,
            MetricData: [
                {
                    MetricName: metricName,
                    Value: value,
                }
            ],
        });
        const result = await this.client.send(command);
        return result;
    }

    async createLogGroup(groupName: string, kmsKeyId: string, logGroupClass: LogGroupClass): Promise<CreateLogGroupCommandOutput> {
        const command = new CreateLogGroupCommand({ 
            logGroupName: groupName,
            kmsKeyId: kmsKeyId,
            logGroupClass: logGroupClass,
        });
        const result = await this.logClient.send(command);
        return result;
    }

    async listLogGroups(): Promise<DescribeLogGroupsCommandOutput> {
        const command = new DescribeLogGroupsCommand({ });
        const result = await this.logClient.send(command);
        return result;
    }

    async createLogStream(groupName: string, streamName: string): Promise<CreateLogStreamCommandOutput> {
        const command = new CreateLogStreamCommand({
            logGroupName: groupName,
            logStreamName: streamName,
        });
        const result = await this.logClient.send(command);
        return result;
    }

    async listLogStreams(groupName: string): Promise<DescribeLogStreamsCommandOutput> {
        const command = new DescribeLogStreamsCommand({ logGroupName: groupName });
        const result = await this.logClient.send(command);
        return result;
    }

    async deleteLogGroup(groupName: string): Promise<DeleteLogGroupCommandOutput> {
        const command = new DeleteLogGroupCommand({ logGroupName: groupName });
        const result = await this.logClient.send(command);
        return result;
    }

    async deleteLogStream(groupName: string, logStream: string): Promise<DeleteLogStreamCommandOutput> {
        const command = new DeleteLogStreamCommand({ logGroupName: groupName, logStreamName: logStream });
        const result = await this.logClient.send(command);
        return result;
    }

    async getLogEvents(groupName: string, logStream: string): Promise<GetLogEventsCommandOutput> {
        const command = new GetLogEventsCommand({
            logGroupName: groupName,
            logStreamName: logStream,
        });
        const result = await this.logClient.send(command);
        return result;
    }

    async putLogEvent(groupName: string, logStream: string, message: string): Promise<PutLogEventsCommandOutput> {
        const command = new PutLogEventsCommand({
            logGroupName: groupName,
            logStreamName: logStream,
            logEvents: [
                { message: message, timestamp: Date.now() },
            ]
        });
        const result = await this.logClient.send(command);
        return result;
    }

}
