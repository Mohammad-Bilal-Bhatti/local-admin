import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Route53Service } from "./route53.service";
import { ChangeAction, ChangeRecordSetDto, CreateHostedZoneDto, RRType } from "./route53.dto";
import { Response } from 'express';

@Controller('route53')
export class Route53Controller {

    constructor(private readonly service: Route53Service) {}

    @Get()
    @Render('route53-list')
    async root() {
        const { HostedZones } = await this.service.listHostedZones();
        return { HostedZones };
    }

    @Get('hosted-zone')
    @Render('route53-hosted-zone')
    async getCreateHostedZone() {
        const now = Date.now();
        return { now };
    }

    @Post('hosted-zone')
    @Redirect('/route53', 302)
    async createHostedZone(@Body() input: CreateHostedZoneDto) {
        const result = await this.service.createHostedZone(input.name, input.callerReference);
        return result;
    }

    @Get('delete-hosted-zone')
    @Redirect('/route53', 302)
    async deleteHostedZone(@Query('id') id: string) {
        const result = await this.service.deleteHostedZone(id);
        return result;
    }

    @Get('hosted-zone-details')
    @Render('route53-hosted-zone-details')
    async hostedZoneDetails(@Query('id') id: string, @Query('tab') tab = 'entries') {

        const ChangeActionOptions = Object.keys(ChangeAction).map(key => ({ label: key, value: ChangeAction[key] }));
        const RecordTypeOptions = Object.keys(RRType).map(key => ({ label: key, value: RRType[key] }));

        const { ResourceRecordSets } = await this.service.getRecordsSet(id);
        return { id, tab, ResourceRecordSets, ChangeActionOptions, RecordTypeOptions };
    }

    @Post('change-record-set')
    async changeRecordSet(@Res() response: Response, @Body() input: ChangeRecordSetDto) {
        const result = await this.service.changeRecordSet(input.hostedZoneId, input.action, input.recordName, input.recordType, input.recordValue);
        response.redirect(302, `/route53/hosted-zone-details?id=${input.hostedZoneId}`);
    }
}
