
export interface CardItem {
    title: string;
    subtitle: string;
    description: string;
    link: string;
}

export interface MenuItem {
    title: string;
    link: string;
}

export const cards: CardItem[] = [
    {
        title: "SQS",
        subtitle: "Simple Queue Service",
        description: "Simple queue service is one of the baisc aws services that store messages. Queues could either be standard queues and fifo queues.",
        link: "/sqs",
    },
    {
        title: "S3",
        subtitle: "Simple Storage Service",
        description: "Simple storage service is one of the baisc aws services that store objects in buckets. Buckets are like folders and objects are like stored files.",
        link: "/s3",
    },
    {
        title: "KMS",
        subtitle: "Key Management Service",
        description: "Key management service is used to manage encryption keys. You can create as many as keys you want. Its serverless service.",
        link: "/kms",
    },
    {
        title: "SNS",
        subtitle: "Simple Notification Service",
        description: "Simple notification is the service which is used as a message broker. Its serverless and supports pub/sub model",
        link: "/sns"
    },
    {
        title: "DDB",
        subtitle: "Dynamo DB",
        description: "Serverless nosql database scales automatically based on load. Highly available, fault tolerance.",
        link: "/dynamodb",
    },
    {
        title: "SM",
        subtitle: "Secrets Manager",
        description: "Store your application secrets in secure vault that is highly available and support credentials rotation.",
        link: "/secrets-manager",
    },
    {
        title: "SSM",
        subtitle: "Simple System Manager",
        description: "Gives you ability to store parameters that can be used by your apps.",
        link: "/ssm"
    },
    {
        title: "Event Bridge",
        subtitle: "Event Bridge",
        description: "Serverless event bus used to decouple your applications and scale your applications.",
        link: "/event-bridge",
    },
    {
        title: 'IAM',
        subtitle: 'Identity and access management',
        description: 'Identity and Access Management is a web service provided by AWS that enables users to control access to AWS resources securely.',
        link: '/iam'
    },
    {
        title: 'ACM',
        subtitle: 'AWS Certificate Manager',
        description: 'AWS Certificate Manager is a service that enables you to create and manage SSL/TLS certificates that can be used to secure applications and resources',
        link: '/acm'
    },
    {
        title: "Lambda",
        subtitle: "AWS Lambda Function",
        description: "AWS Lambda is a Serverless Function as a Service platform that lets you run code in your preferred programming language on the AWS ecosystem",
        link: "/lambda"
    },
    {
        title: 'EC2',
        subtitle: 'Elastic Compute Cloud',
        description: 'Elastic Compute Cloud is a core service within Amazon Web Services that provides scalable and flexible virtual computing resources',
        link: '/ec2'
    },
    {
        title: "AWS API GW",
        subtitle: "API Gateway",
        description: "API Gateway is a managed service that enables developers to create, deploy, and manage APIs (Application Programming Interfaces)",
        link: "/gateway"
    }
];

export const menuItems: MenuItem[] = [
    { title: 'Dashboard', link: '/' },
    { title: 'IAM', link: '/iam' },
    { title: 'SQS', link: '/sqs' },
    { title: 'S3', link: '/s3' },
    { title: 'KMS', link: '/kms' },
    { title: 'SNS', link: '/sns' },
    { title: 'DDB', link: '/dynamodb' },
    { title: 'SM', link: '/secrets-manager' },
    { title: 'SSM', link: '/ssm' },
    { title: 'Event Bridge', link: '/event-bridge' },
    { title: 'ACM', link: '/acm' },
    { title: 'Lambda', link: '/lambda' },
    { title: 'EC2', link: '/ec2' },
    { title: 'GW', link: '/gateway' }
];
