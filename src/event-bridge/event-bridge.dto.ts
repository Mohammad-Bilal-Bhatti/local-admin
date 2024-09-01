
export class CreateRuleInput {
    name: string;
    description: string;
    scheduleExpression: string;
}

export class TargetInput {
    Id: string;
    Arn: string;
}

export class CreateTargetInput {
    rule: string;
    targets: TargetInput[];
}
