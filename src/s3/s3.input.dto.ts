
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
