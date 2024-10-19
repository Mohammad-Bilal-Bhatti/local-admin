
export interface CardItem {
    title: string;
    subtitle: string;
    description: string;
    link: string;
    bicon?: string;
}

export interface MenuItem {
    title: string;
    link: string;
    bicon?: string;
}

export const cards: CardItem[] = [
    {
        title: 'ACM',
        subtitle: 'AWS Certificate Manager',
        description: 'AWS Certificate Manager is a service that enables you to create and manage SSL/TLS certificates that can be used to secure applications and resources',
        link: '/acm',
        bicon: 'shield-lock'
    },
    {
        title: 'CW',
        subtitle: 'Cloud Watch',
        description: 'CloudWatch is a comprehensive monitoring and observability service that Amazon Web Services (AWS) provides',
        link: '/cw',
        bicon: 'bar-chart'
    },
    {
        title: "DDB",
        subtitle: "Dynamo DB",
        description: "Serverless nosql database scales automatically based on load. Highly available, fault tolerance.",
        link: "/dynamodb",
        bicon: 'table'
    },
    {
        title: 'EC2',
        subtitle: 'Elastic Compute Cloud',
        description: 'Elastic Compute Cloud is a core service within Amazon Web Services that provides scalable and flexible virtual computing resources',
        link: '/ec2',
        bicon: 'cpu'
    },
    {
        title: "Event Bridge",
        subtitle: "Event Bridge",
        description: "Serverless event bus used to decouple your applications and scale your applications.",
        link: "/event-bridge",
        bicon: 'graph-up'
    },
    {
        title: "AWS API GW",
        subtitle: "API Gateway",
        description: "API Gateway is a managed service that enables developers to create, deploy, and manage APIs (Application Programming Interfaces)",
        link: "/gateway",
        bicon: 'diagram-3'
    },
    {
        title: 'IAM',
        subtitle: 'Identity and access management',
        description: 'Identity and Access Management is a web service provided by AWS that enables users to control access to AWS resources securely.',
        link: '/iam',
        bicon: 'person-badge'
    },
    {
        title: 'Kinesis',
        subtitle: 'Kinesis',
        description: 'Kinesis is a platform provided by Amazon Web Services (AWS) that enables your application to ingest, buffer, and process data in real-time',
        link: '/kinesis',
        bicon: 'shuffle'
    },
    {
        title: "KMS",
        subtitle: "Key Management Service",
        description: "Key management service is used to manage encryption keys. You can create as many as keys you want. Its serverless service.",
        link: "/kms",
        bicon: 'key'
    },
    {
        title: "Lambda",
        subtitle: "AWS Lambda Function",
        description: "AWS Lambda is a Serverless Function as a Service platform that lets you run code in your preferred programming language on the AWS ecosystem",
        link: "/lambda",
        bicon: 'lightning-fill'
    },
    {
        title: "S3",
        subtitle: "Simple Storage Service",
        description: "Simple storage service is one of the baisc aws services that store objects in buckets. Buckets are like folders and objects are like stored files.",
        link: "/s3",
        bicon: 'bucket-fill'
    },
    {
        title: "SM",
        subtitle: "Secrets Manager",
        description: "Store your application secrets in secure vault that is highly available and support credentials rotation.",
        link: "/secrets-manager",
        bicon: 'safe'
    },
    {
        title: "SNS",
        subtitle: "Simple Notification Service",
        description: "Simple notification is the service which is used as a message broker. Its serverless and supports pub/sub model",
        link: "/sns",
        bicon: 'broadcast'
    },
    {
        title: "SQS",
        subtitle: "Simple Queue Service",
        description: "Simple queue service is one of the baisc aws services that store messages. Queues could either be standard queues and fifo queues.",
        link: "/sqs",
        bicon: 'inbox'
    },
    {
        title: "SSM",
        subtitle: "Simple System Manager",
        description: "Gives you ability to store parameters that can be used by your apps.",
        link: "/ssm",
        bicon: 'wrench'
    },
];

export const menuItems: MenuItem[] = [
    { title: 'Home', link: '/', bicon: 'house' },
    { title: 'ACM', link: '/acm', bicon: 'shield-lock' }, 
    { title: 'CW', link: '/cw', bicon: 'bar-chart' }, 
    { title: 'DDB', link: '/dynamodb', bicon: 'table' }, 
    { title: 'EC2', link: '/ec2', bicon: 'cpu' }, 
    { title: 'Event Bridge', link: '/event-bridge', bicon: 'graph-up' }, 
    { title: 'GW', link: '/gateway', bicon: 'diagram-3' }, 
    { title: 'IAM', link: '/iam', bicon: 'person-badge' }, 
    { title: 'Kinesis', link: '/kinesis', bicon: 'shuffle' }, 
    { title: 'KMS', link: '/kms', bicon: 'key' }, 
    { title: 'Lambda', link: '/lambda', bicon: 'lightning-fill' }, 
    { title: 'S3', link: '/s3', bicon: 'bucket-fill' }, 
    { title: 'SM', link: '/secrets-manager', bicon: 'safe' }, 
    { title: 'SNS', link: '/sns', bicon: 'broadcast' }, 
    { title: 'SQS', link: '/sqs', bicon: 'inbox' }, 
    { title: 'SSM', link: '/ssm', bicon: 'wrench' },
];