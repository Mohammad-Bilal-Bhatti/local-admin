import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { LambdaService } from "./lambda.service";
import { CreateAliasDto, CreateLambdaDto, InvokeLambdaDto, Runtime } from "./lambda.dto";

@Controller('lambda')
export class LambdaController {

    constructor(private readonly service: LambdaService) {}

    @Get()
    @Render('lambda-list')
    async getLambdas() {
        const result = await this.service.listLabmdaFunctions();
        return { Functions: result.Functions };
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
    async getLambdaDetails(@Query('name') name: string) {
        const { $metadata, ...details } = await this.service.getLambdaFunction(name);
        const aliases = await this.service.listAliases(name);
        return { functionName: name, details, Aliases: aliases.Aliases };
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

}
