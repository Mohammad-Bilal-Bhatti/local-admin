
export class CreateBucketInput {
    name: string;
}

export class UploadObjectInput {
    bucket: string;
}

export class EncryptDecryptInput {
    keyId: string;
    plain?: string;
    encrypted?: string;
}