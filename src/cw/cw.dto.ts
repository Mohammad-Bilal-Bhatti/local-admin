import { LogGroupClass } from '@aws-sdk/client-cloudwatch-logs';

export class CreateLogGroupDto {
    groupName: string;
    kmsKeyId?: string;
    logGroupClass?: LogGroupClass;
}

export class CreateLogStreamDto {
    groupName: string;
    streamName: string;
}


export { LogGroupClass } from '@aws-sdk/client-cloudwatch-logs';