import { LogGroupClass } from '@aws-sdk/client-cloudwatch-logs';
import { ComparisonOperator, Statistic } from '@aws-sdk/client-cloudwatch';

export class CreateLogGroupDto {
    groupName: string;
    kmsKeyId?: string;
    logGroupClass?: LogGroupClass;
}

export class CreateLogStreamDto {
    groupName: string;
    streamName: string;
}

export class CreateMetricAlarmDto {
    alarmName: string; 
    description: string;
    metricName: string; 
    comparisonOperator: ComparisonOperator;
    evaluationPeriod: number;
    period: number;
    threshold: number;
    statistic: Statistic;
    namespace: string;
    alarmAction: string;
    okAction: string;
    insufficientDataAction: string;
    dimensions: {
        name: string,
        value: string,
    }
}

export class PutMetricDataDto {
    namespace: string;
    metricName: string;
    value: string;
}


export { LogGroupClass, } from '@aws-sdk/client-cloudwatch-logs';
export { ComparisonOperator, Statistic, StateValue } from '@aws-sdk/client-cloudwatch';
