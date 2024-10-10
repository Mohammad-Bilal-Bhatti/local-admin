import { Event } from '@aws-sdk/client-s3'
export class CreateBucketInput {
    name: string;
}

export class UploadObjectInput {
    bucket: string;
    key?: string; /* optional key attribute */ 
}

export class PutBucketPolicyDto {
    bucket: string;
    policy: string;
}

export class CreateWebsiteDto {
    bucket: string;
    error: string;
    index: string;
}

export class PutBucketVersioningDto {
    bucket: string;
    enableVersioning: string;
    enableMfaDelete: string;
}

export class PutBucketCorsPolicyDto {
    bucket: string;
    AllowedHeaders: string | string[];
    AllowedMethods: string | string[];
    AllowedOrigins: string | string[];
    ExposeHeaders: string | string[];
}

export class CreateBucketNoficationDto {
    bucket: string;
    target: 'sqs' | 'sns' | 'lambda';
    targetArn: string;
    events: Event | Event[];
}

export class CreateBucketReplicationDto {
    bucket: string;
    role: string;
    destinationBucket: string;
    deleteMarkerReplication: string;
    existingObjectReplication: string;
}

export { Event } from '@aws-sdk/client-s3';
