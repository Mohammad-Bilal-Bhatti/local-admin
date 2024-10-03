
export class CreateBucketInput {
    name: string;
}

export class UploadObjectInput {
    bucket: string;
    key?: string; /* optional key attribute */ 
}
