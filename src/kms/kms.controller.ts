import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { KmsService } from "./kms.service";
import { CreateAliasInput, CreateKeyInput, EncryptDecryptInput } from "./kms.input.dto";

@Controller('kms')
export class KmsController {

    constructor(private readonly kmsService: KmsService) {}

    @Get()
    @Render('kms-list')
    async getList() {
        const result = await this.kmsService.listKeys();
        const aliases = await this.kmsService.getAliases();

        for (const key of result.Keys) {
            const description = await this.kmsService.describeKey(key.KeyId);

            /* append key meta data to key item */
            key['KeyMetadata'] = description.KeyMetadata;
        }

        return { Keys: result.Keys, Aliases: aliases.Aliases };
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
    async encryptDecrypt(@Body() input: EncryptDecryptInput) {
        const { keyId, plain, encrypted } = input;

        if (plain) {
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(plain);
            const result = await this.kmsService.encrypt(keyId, encodedData);
            const encryptedData = this.kmsService.unit8ArrayToBase64(result.CiphertextBlob);
            return { keyId, encrypted: encryptedData };
        }

        if (encrypted) {
            const decoder = new TextDecoder();
            const data = this.kmsService.base64ToUint8Array(encrypted);            
            const result = await this.kmsService.decrypt(data);
            const plainData = decoder.decode(result.Plaintext);
            return { keyId, plain: plainData };
        }
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
        return null;
    }

    @Post('create')
    @Redirect('/kms', 302)
    async createKey(
        @Body() input: CreateKeyInput,
    ) {
        const response = await this.kmsService.createKey(input.description);
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

}
