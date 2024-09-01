import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
    KMSClient,
    ListKeysCommand,
    ListKeysCommandOutput, 
    DisableKeyCommand,
    DisableKeyCommandOutput,
    DescribeKeyCommand,
    DescribeKeyCommandOutput,
    EnableKeyCommand,
    EnableKeyCommandOutput,
    CreateKeyCommand,
    CreateKeyCommandOutput,
    ListAliasesCommand,
    ListAliasesCommandOutput,
    CreateAliasCommand,
    CreateAliasCommandOutput,
    DeleteAliasCommand,
    DeleteAliasCommandOutput,
    EncryptCommand,
    EncryptCommandOutput,
    DecryptCommand,
    DecryptCommandOutput,
} from "@aws-sdk/client-kms";

@Injectable()
export class KmsService {

    private client: KMSClient;

    constructor(private readonly configService: ConfigService) {
        this.client = new KMSClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        })
    }

    async listKeys(): Promise<ListKeysCommandOutput> {
        const command = new ListKeysCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async disableKey(keyId: string): Promise<DisableKeyCommandOutput> {
        const command = new DisableKeyCommand({
            KeyId: keyId,
        });
        const response = await this.client.send(command);
        return response;
    }

    async enableKey(keyId: string): Promise<EnableKeyCommandOutput> {
        const command = new EnableKeyCommand({
            KeyId: keyId,
        });
        const response = await this.client.send(command);
        return response;
    }

    async describeKey(keyId: string): Promise<DescribeKeyCommandOutput> {
        const command = new DescribeKeyCommand({
            KeyId: keyId,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createKey(description: string): Promise<CreateKeyCommandOutput> {
        const command = new CreateKeyCommand({
            Description: description,                
        });
        const response = await this.client.send(command);
        return response;
    }

    async getAliases(keyId?: string): Promise<ListAliasesCommandOutput> {
        const command = new ListAliasesCommand({
            ...(keyId && { KeyId: keyId })
        });
        const response = await this.client.send(command);
        return response;
    }

    async createAlias(keyId: string, alias: string): Promise<CreateAliasCommandOutput> {
        const command = new CreateAliasCommand({
            AliasName: alias,
            TargetKeyId: keyId,
        });

        const response = await this.client.send(command);
        return response;
    }

    async encrypt(keyId: string, plain: Uint8Array): Promise<EncryptCommandOutput> {
        const command = new EncryptCommand({ KeyId: keyId, Plaintext: plain });
        const response = await this.client.send(command);
        return response;
    }

    async decrypt(encrypted: Uint8Array) {
        const command = new DecryptCommand({
            CiphertextBlob: encrypted,
        });
        const response = await this.client.send(command);
        return response;
    }

    unit8ArrayToBase64(uint8Array: Uint8Array): string {
        // Convert the Uint8Array to a binary string
        let binaryString = "";
        for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
        }

        // Convert the binary string to Base64
        return btoa(binaryString);
    }

    base64ToUint8Array(base64: string): Uint8Array {
        // Decode the Base64 string to a binary string
        const binaryString = atob(base64);

        // Create a Uint8Array from the binary string
        const len = binaryString.length;
        const uint8Array = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return uint8Array;
    }

    async deleteAlias(alias: string): Promise<DeleteAliasCommandOutput> {
        const command = new DeleteAliasCommand({ AliasName: alias });
        const response = await this.client.send(command);
        return response;
    }

}
