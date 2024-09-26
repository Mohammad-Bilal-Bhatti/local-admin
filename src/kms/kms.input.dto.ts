import { KeyUsageType } from '@aws-sdk/client-kms';

export class CreateKeyInput {
    description: string;
    keyUsage: KeyUsageType;
}

export class CreateAliasInput {
    keyId: string;
    alias: string;
}

export class EncryptDecryptSignInput {
    keyId: string;
    operation: string;
    input: string;
}

export { SigningAlgorithmSpec, KeyUsageType  } from '@aws-sdk/client-kms';