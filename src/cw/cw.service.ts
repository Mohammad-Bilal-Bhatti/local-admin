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
    DescribeLogGroupsCommand,
    DescribeLogGroupsCommandOutput,
    LogGroupClass,
} from "@aws-sdk/client-cloudwatch-logs";

@Injectable()
export class CWService implements ConfigurableService {

    private client: CloudWatchClient;
    private logClient: CloudWatchLogsClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new CloudWatchClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.endpoint'),
        });
        this.logClient = new CloudWatchLogsClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.endpoint'),
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

}
