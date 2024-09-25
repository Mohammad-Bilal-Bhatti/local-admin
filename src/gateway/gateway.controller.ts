import { Body, Controller, Get, Post, Query, Redirect, Render, Req, Res } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { CreateMethodDto, CreateResourceDto, CreateRestApiDto } from "./gateway.dto";
import { Response } from 'express';

@Controller('gateway')
export class GatewayController {
    constructor(private readonly service: GatewayService) {}

    @Get()
    @Render('gateway-list')
    async getList() {
        const { items } = await this.service.getRestApis();
        return { items };
    }

    @Get('create-api')
    @Render('gateway-create-api')
    async getCreateApi() {
        return {};
    }

    @Post('create-api')
    @Redirect('/gateway')
    async createApi(@Body() input: CreateRestApiDto) {
        const result = await this.service.createRestApi(input.name, input.description);
        return null;
    }

    @Get('delete')
    @Redirect('/gateway')
    async deleteRestApi(@Query('id') id: string) {
        const result = await this.service.deleteRestApi(id);
        return null;
    }

    @Get('details')
    @Render('gateway-details')
    async gatewayDetails(@Query('id') id: string) {
        const { $metadata, ...details } = await this.service.getRestApi(id);
        const { items: resources } = await this.service.getResources(id);
        return { id, details, resources };
    }

    @Post('resource')
    async createResource(
        @Res() response: Response,
        @Body() input: CreateResourceDto
    ) {
        const result = await this.service.createResource(input.restApiId, input.parentId, input.pathPart);
        return response.redirect(302, `/gateway/details?id=${input.restApiId}`);
    }

    @Post('method')
    async createMethod(
        @Res() response: Response,
        @Body() input: CreateMethodDto
    ) {
        const result = await this.service.putMethod(
            input.restApiId, 
            input.resourceId, 
            input.httpMethod, 
            input.authorizationType
        );
        return response.redirect(302, `/gateway/details?id=${input.restApiId}`);
    }

}
