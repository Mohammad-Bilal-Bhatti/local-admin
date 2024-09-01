
export class CreateKeyInput {
    description: string;
}

export class CreateAliasInput {
    keyId: string;
    alias: string;
}

export class EncryptDecryptInput {
    keyId: string;
    plain?: string;
    encrypted?: string;
}