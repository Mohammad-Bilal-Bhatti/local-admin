
export class StartWorkflowDto {
    stateMachineArn: string;
    input: string;
}

export class CreateStateMachineDto {
    name: string;
    definition: string;
    roleArn: string;
}
