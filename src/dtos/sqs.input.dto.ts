
export class MessageAttribute {
    name: string;
    value: string;
}
export class CreateQueueInput {
    name: string;
    fifoQueue: string;
}

export class SendMessageInput {
    queueUrl: string;
    body: string;
    groupId?: string;
    duplicationId?: string;
    messageAttributes?: MessageAttribute[]
}

export class DeleteMessageInput {
    queueUrl: string;
    receiptHandle: string;
}
