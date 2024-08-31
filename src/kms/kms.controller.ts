import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { KmsService } from "./kms.service";
import { CreateAliasInput, CreateKeyInput } from "src/dtos/kms.input.dto";
import { EncryptDecryptInput } from "src/dtos/s3.input.dto";

@Controller('kms')
export class KmsController {

    constructor(private readonly kmsService: KmsService) {}

    @Get()
    async getList(@Res() res: Response) {
        const result = await this.kmsService.listKeys();
        const aliases = await this.kmsService.getAliases();

        for (const key of result.Keys) {
            const description = await this.kmsService.describeKey(key.KeyId);

            /* append key meta data to key item */
            key['KeyMetadata'] = description.KeyMetadata;
        }

        return res.render('kms-list', { Keys: result.Keys, Aliases: aliases.Aliases });
    }

    @Get('disable')
    async disableKey(
        @Query('keyId') keyId: string,
        @Res() res: Response,
    ) {
        const result = await this.kmsService.disableKey(keyId);
        return res.redirect(302, '/kms');
    }

    @Get('enable')
    async enableKey(
        @Query('keyId') keyId: string,
        @Res() res: Response,
    ) {
        const result = await this.kmsService.enableKey(keyId);
        return res.redirect(302, '/kms');
    }

    @Get('encrypt-decrypt')
    async getEncryptDecrypt(
        @Res() res: Response,
        @Query('keyId') keyId: string,
    ) {

        return res.render('kms-encrypt-decrypt', { keyId });
    }

    @Post('encrypt-decrypt')
    async encryptDecrypt(@Res() res: Response, @Body() input: EncryptDecryptInput) {
        const { keyId, plain, encrypted } = input;

        if (plain) {
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(plain);
            const result = await this.kmsService.encrypt(keyId, encodedData);
            const encryptedData = this.kmsService.unit8ArrayToBase64(result.CiphertextBlob);
            return res.render('kms-encrypt-decrypt', { keyId, encrypted: encryptedData });
        }

        if (encrypted) {
            const decoder = new TextDecoder();
            const data = this.kmsService.base64ToUint8Array(encrypted);            
            const result = await this.kmsService.decrypt(data);
            const plainData = decoder.decode(result.Plaintext);
            return res.render('kms-encrypt-decrypt', { keyId, plain: plainData });
        }
    }

    @Get('details')
    async getKeyDetails(
        @Query('keyId') keyId: string,
        @Res() res: Response
    ) {
        const response = await this.kmsService.describeKey(keyId);
        const aliases = await this.kmsService.getAliases(keyId);
        return res.render('kms-key-detail', { keyId, KeyMetadata: response.KeyMetadata, Aliases: aliases.Aliases });
    }

    @Get('create')
    async getCreateKey(@Res() res: Response) {
        return res.render('kms-create-key', {});
    }

    @Post('create')
    async createKey(
        @Res() res: Response,
        @Body() input: CreateKeyInput,
    ) {
        const response = await this.kmsService.createKey(input.description);
        return res.redirect(302, '/kms');
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
