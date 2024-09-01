import { Body, Controller, Get, ParseIntPipe, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { SecretsManagerService } from "./secrets-manager.service";
import { CreateSecretInput } from "./secrets-manager.dto";

@Controller('secrets-manager')
export class SecretsManagerController {

    constructor(private readonly service: SecretsManagerService) {}

    @Get()
    @Render('secrets-manager-list')
    async getList(
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
        @Query('nextToken') nextToken: string,
    ) {
        const result = await this.service.getSecretsList(limit, nextToken);
        return { SecretList: result.SecretList, NextToken: result.NextToken, limit };
    }

    @Get('details')
    @Render('secrets-manager-item')
    async getSecretDetails(
        @Query('secretId') secretId: string,
    ) {
        const { $metadata, ...details } = await this.service.getSecretDetails(secretId);
        return { secretId, details: details };
    }

    @Get('create')
    @Render('secrets-manager-create')
    async getCreateSecretPage() {
        return {};
    }

    @Post('create')
    @Redirect('/secrets-manager', 302)
    async createSecret(@Body() input: CreateSecretInput) {
        const response = await this.service.createSecret(input.name, input.description, input.secret);
        return null;
    }

    @Get('remove')
    @Redirect('secrets-manager', 302)
    async deleteSecret(@Query('secretId') secretId: string) {
        const resonse = await this.service.deleteSecret(secretId);
        return null;
    }

}
