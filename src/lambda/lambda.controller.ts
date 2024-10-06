import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { LambdaService } from "./lambda.service";
import { CreateAliasDto, CreateLambdaDto, InvokeLambdaDto, Runtime, UpdateFunctionCodeDto } from "./lambda.dto";

@Controller('lambda')
export class LambdaController {

    constructor(private readonly service: LambdaService) {}

    @Get()
    @Render('lambda-list')
    async getLambdas() {
        const { Functions } = await this.service.listLabmdaFunctions();
        return { Functions };
    }

    @Get('create')
    @Render('lambda-create')
    async getCreateLambda() {
        const runtimes = Object.values(Runtime);
        return { runtimes };
    }

    @Post('create')
    @Redirect('/lambda', 302)
    async createLambda(@Body() input: CreateLambdaDto) {
        const result = await this.service.createLambdaFunction(input.name, input.description, input.role, input.s3Bucket, input.s3Key, input.runtime, input.handler);
        return null;
    }

    @Get('remove')
    @Redirect('/lambda', 302)
    async removeFunction(@Query('name') name: string) {
        const result = await this.service.removeFunction(name);
        return null;
    }

    @Get('details')
    @Render('lambda-details')
    async getLambdaDetails(@Query('name') name: string, @Query('tab') tab = 'details') {
        const { $metadata, ...details } = await this.service.getLambdaFunction(name);
        const result = { tab, functionName: name, details };
        switch(tab) {
            case 'update': {
                break;
            }
            case 'invoke': {
                break;
            }
            case 'aliases': {
                const aliases = await this.service.listAliases(name);
                Object.assign(result, { Aliases: aliases.Aliases });
                break;
            }
            default:
            case 'details': {
                break;
            }
        }

        return result;
    }

    @Post('invoke')
    @Render('lambda-invoke')
    async invokeLambda(@Body() input: InvokeLambdaDto) {
        const result = await this.service.invokeLambdaFunction(input.name, input.payload);
        const { ExecutedVersion, FunctionError, LogResult, Payload, StatusCode } = result;
        const payload = new TextDecoder().decode(Payload);
        return { ExecutedVersion, FunctionError, LogResult, StatusCode, payload };
    }

    @Post('alias')
    async createAlias(@Res() res: Response, @Body() input: CreateAliasDto) {
        const result = await this.service.createAlias(input.name, input.functionName, input.functionVersion);
        return res.redirect(302, `/lambda/details?name=${input.functionName}`);
    }

    @Get('delete-alias')
    async deleteAlias(@Res() res: Response, @Query('name') name: string, @Query('functionName') functionName: string) {
        const result = await this.service.deleteAlias(name, functionName);
        return res.redirect(302, `/lambda/details?name=${functionName}`);
    }

    @Post('update-function-code')
    async updateFunctionCode(@Res() res: Response, @Body() input: UpdateFunctionCodeDto) {
        const result = await this.service.updateFunctionCode(input.functionName, input.s3Bucket, input.s3Key);
        return res.redirect(302, `/lambda/details?name=${input.functionName}`);
    }

    @Get('publish')
    @Redirect('/lambda', 302)
    async getPublishFunction(@Query('name') functionName: string) {
        const result = await this.service.publishVersion(functionName);
        return result;
    }

}
