import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { LambdaService } from "./lambda.service";
import { CreateAliasDto, CreateLambdaDto, InvokeLambdaDto, Runtime } from "src/dtos/lambda.dto";

@Controller('lambda')
export class LambdaController {

    constructor(private readonly service: LambdaService) {}

    @Get()
    async getLambdas(@Res() res: Response) {
        const result = await this.service.listLabmdaFunctions();
        console.log('data: ', result.Functions);
        return res.render('lambda-list', { Functions: result.Functions });
    }

    @Get('create')
    async getCreateLambda(@Res() res: Response) {
        const runtimes = Object.values(Runtime);
        return res.render('lambda-create', { runtimes });
    }

    @Post('create')
    async createLambda(@Res() res: Response, @Body() input: CreateLambdaDto) {
        const result = await this.service.createLambdaFunction(input.name, input.description, input.role, input.s3Bucket, input.s3Key, input.runtime, input.handler);
        return res.redirect(302, '/lambda');
    }

    @Get('remove')
    async removeFunction(@Res() res: Response, @Query('name') name: string) {
        const result = await this.service.removeFunction(name);
        return res.redirect(302, '/lambda');
    }

    @Get('details')
    async getLambdaDetails(@Res() res: Response, @Query('name') name: string) {
        const { $metadata, ...details } = await this.service.getLambdaFunction(name);
        const aliases = await this.service.listAliases(name);
        console.log('aliases: ', aliases);
        return res.render('lambda-details', { functionName: name, details, Aliases: aliases.Aliases });
    }

    @Post('invoke')
    async invokeLambda(@Res() res: Response, @Body() input: InvokeLambdaDto) {
        const result = await this.service.invokeLambdaFunction(input.name, input.payload);
        const { ExecutedVersion, FunctionError, LogResult, Payload, StatusCode } = result;
        const payload = new TextDecoder().decode(Payload);
        return res.render('lambda-invoke', { ExecutedVersion, FunctionError, LogResult, StatusCode, payload  });
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
