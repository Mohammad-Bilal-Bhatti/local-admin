
export class CreateRuleInput {
    name: string;
    description: string;
    scheduleExpression: string;
    eventBusname: string;
    eventPattern: string;
}

export class TargetInput {
    Id: string;
    Arn: string;
}

export class CreateTargetInput {
    rule: string;
    eventBusName: string;
    targets: TargetInput[];
}

export class CreateEventBusDto {
    name: string;
    description: string;
}

export class CreateEventArchiveDto {
    archiveName: string;
    description: string;
    eventSourceArn: string;
    retentionDays: string;
}

export class PublishEventDto {
    eventBusName: string;
    source: string;
    detailType: string;
    detail: string;
}

export class CreateReplayDto {
    archiveName: string;
    replayName: string;
    sourceArn: string;
    destinationArn: string;
    startTime: Date;
    endTime: Date;
}
