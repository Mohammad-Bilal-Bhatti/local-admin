import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { KmsService } from "./kms.service";
import { CreateAliasInput, CreateKeyInput, EncryptDecryptSignInput, KeyUsageType } from "./kms.input.dto";

@Controller('kms')
export class KmsController {

    constructor(private readonly kmsService: KmsService) {}

    @Get()
    @Render('kms-list')
    async getList(@Query('tab') tab = 'keys') {

        const data = { tab };
        switch (tab) {
            case 'aliases': {
                const { Aliases } = await this.kmsService.getAliases();
                Object.assign(data, { Aliases });
                break;
            }
            default:
                case 'keys': {
                    const { Keys } = await this.kmsService.listKeys();
                    for (const key of Keys) {
                        const description = await this.kmsService.describeKey(key.KeyId);
            
                        /* append key meta data to key item */
                        key['KeyMetadata'] = description.KeyMetadata;
                    }
    
                    Object.assign(data, { Keys });
                    break;
                }
        }
        return data;
    }

    @Get('disable')
    @Redirect('/kms', 302)
    async disableKey(
        @Query('keyId') keyId: string,
    ) {
        const result = await this.kmsService.disableKey(keyId);
        return null;
    }

    @Get('enable')
    @Redirect('/kms', 302)
    async enableKey(
        @Query('keyId') keyId: string,
    ) {
        const result = await this.kmsService.enableKey(keyId);
        return null;
    }

    @Get('encrypt-decrypt')
    @Render('kms-encrypt-decrypt')
    async getEncryptDecrypt(
        @Query('keyId') keyId: string,
    ) {

        return { keyId };
    }

    @Post('encrypt-decrypt')
    @Render('kms-encrypt-decrypt')
    async encryptDecrypt(@Body() input: EncryptDecryptSignInput) {
        const { keyId, input: __input, operation } = input;
        const result = { keyId };

        switch(operation) {
            case 'sign': {
                const encoder = new TextEncoder();
                const message = encoder.encode(__input);
                const { Signature } = await this.kmsService.sign(keyId, message, 'RSASSA_PSS_SHA_256');
                const signData = this.kmsService.unit8ArrayToBase64(Signature);
                Object.assign(result, { output: signData });
                break;
            }
            case 'decrypt': {
                const decoder = new TextDecoder();
                const data = this.kmsService.base64ToUint8Array(__input);            
                const { Plaintext } = await this.kmsService.decrypt(data);
                const plainData = decoder.decode(Plaintext);
                Object.assign(result, { output: plainData });
                break;
            }
            default:
            case 'encrypt': {
                const encoder = new TextEncoder();
                const encodedData = encoder.encode(__input);
                const { CiphertextBlob } = await this.kmsService.encrypt(keyId, encodedData);
                const encryptedData = this.kmsService.unit8ArrayToBase64(CiphertextBlob);
                Object.assign(result, { output: encryptedData });
                break;
            }
        }

        return result;
    }

    @Get('details')
    @Render('kms-key-detail')
    async getKeyDetails(
        @Query('keyId') keyId: string,
    ) {
        const response = await this.kmsService.describeKey(keyId);
        const aliases = await this.kmsService.getAliases(keyId);
        return { keyId, KeyMetadata: response.KeyMetadata, Aliases: aliases.Aliases };
    }

    @Get('create')
    @Render('kms-create-key')
    async getCreateKey() {
        const keyUsageOptions = Object.keys(KeyUsageType).map(key => ({ label: key, value: KeyUsageType[key] }));
        return { keyUsageOptions };
    }

    @Post('create')
    @Redirect('/kms', 302)
    async createKey(
        @Body() input: CreateKeyInput,
    ) {
        const response = await this.kmsService.createKey(input.description, input.keyUsage);
        return null;
    }

    @Post('create-alias')
    async createAlias(@Res() res: Response, @Body() input: CreateAliasInput) {
        if (!input?.alias?.startsWith('alias/')) {
            input.alias = 'alias/' + input.alias;
        }

        const response = await this.kmsService.createAlias(input.keyId, input.alias);
        return res.redirect(302, `/kms/details?keyId=${input.keyId}`);
    }

    @Get('delete-key')
    @Redirect('/kms', 302)
    async deletekey(@Query('keyId') keyId: string) {
        const result = await this.kmsService.deleteKey(keyId);
        return null;
    }

    @Get('delete-alias')
    @Redirect('/kms', 302)
    async deleteAlias(@Query('alias') alias: string) {
        const result = await this.kmsService.deleteAlias(alias);
        return null;
    }

}
