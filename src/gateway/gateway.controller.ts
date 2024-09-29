import { Body, Controller, Get, Post, Query, Redirect, Render, Req, Res } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { CreateDeploymentDto, CreateIntegrationDto, CreateMethodDto, CreateResourceDto, CreateRestApiDto, CreateStageDto, IntegrationType } from "./gateway.dto";
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
    async gatewayDetails(
        @Query('id') restApiId: string,
        @Query('tab') tab = 'create',
    ) {

        const { $metadata, ...details } = await this.service.getRestApi(restApiId);

        const result = { id: restApiId, tab, details };

        switch(tab) {
            case 'stages': {
                const { item: stages } = await this.service.getStages(restApiId);
                Object.assign(result, { stages });
                break;
            }
            case 'deployments': {
                const { items: deployments } = await this.service.listDeployments(restApiId);
                Object.assign(result, { deployments });
                break;
            }
            case 'resources': {
                const { items: resources } = await this.service.getResources(restApiId);
                Object.assign(result, { resources });
                break;
            }
            default:
            case 'create': {
                const integrationOptions = Object.keys(IntegrationType).map(key => ({ value: key, label: IntegrationType[key] }));
                Object.assign(result, { integrationOptions });
                break;
            }
        }

        return result;
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

    @Post('deployment')
    async createDeployment(
        @Res() response: Response,
        @Body() input: CreateDeploymentDto
    ) {
        const result = await this.service.createDeployment(input.restApiId, input.description);
        return response.redirect(302, `/gateway/details?id=${input.restApiId}`);
    }

    @Post('integration')
    async craeteIntegration(
        @Res() response: Response,
        @Body() input: CreateIntegrationDto,
    ) {
        const result = await this.service.putIntegration(
            input.restApiId,
            input.resourceId,
            input.httpMethod,
            input.integrationType,
            input.httpMethod,
            input.uri,
            input.passthroughBehavior,
        );
        return response.redirect(302, `/gateway/details?id=${input.restApiId}`);
    }

    @Post('stage')
    async createStage(
        @Res() response: Response,
        @Body() input: CreateStageDto,
    ) {

        const result = await this.service.createStage(
            input.stageName,
            input.description,
            input.deploymentId,
            input.restApiId,
        );

        return response.redirect(302, `/gateway/details?id=${input.restApiId}`);
    }

}
