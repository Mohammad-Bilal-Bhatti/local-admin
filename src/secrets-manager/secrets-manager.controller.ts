import { Body, Controller, Get, ParseIntPipe, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { SecretsManagerService } from "./secrets-manager.service";
import { CreateSecretInput } from "src/dtos/secrets-manager.dto";

@Controller('secrets-manager')
export class SecretsManagerController {

    constructor(private readonly service: SecretsManagerService) {}

    @Get()
    async getList(
        @Res() res: Response, 
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
        @Query('nextToken') nextToken: string,
    ) {
        const result = await this.service.getSecretsList(limit, nextToken);
        return res.render('secrets-manager-list', { SecretList: result.SecretList, NextToken: result.NextToken, limit });
    }

    @Get('details')
    async getSecretDetails(
        @Res() res: Response,
        @Query('secretId') secretId: string,
    ) {
        const { $metadata, ...details } = await this.service.getSecretDetails(secretId);
        return res.render('secrets-manager-item', { secretId, details: details });
    }

    @Get('create')
    async getCreateSecretPage(@Res() res: Response) {
        return res.render('secrets-manager-create', {});
    }

    @Post('create')
    async createSecret(@Res() res: Response, @Body() input: CreateSecretInput) {
        const response = await this.service.createSecret(input.name, input.description, input.secret);
        return res.redirect(302, '/secrets-manager');
    }

    @Get('remove')
    async deleteSecret(@Res() res: Response, @Query('secretId') secretId: string) {
        const resonse = await this.service.deleteSecret(secretId);
        return res.redirect(302, '.');
    }

}
