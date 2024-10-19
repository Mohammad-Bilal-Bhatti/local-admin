
export class TagInput {
    Key: string;
    Value: string;
}

export class CreateTopicInput {
    name: string;
    fifoTopic: string;
    contentBasedDeduplication: string;
    tags: TagInput[];
}

export class PublishMessageInput {
    topicArn: string;
    message: string;
}

export class SubscribeTopicInput {
    topicArn: string;
    protocol: string;
    endpoint: string;
}

export class ConfirmSubscriptionInput {
    topicArn: string;
    token: string;
}

