import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { EventBridgeService } from "./event-bridge.service";
import { CreateEventArchiveDto, CreateEventBusDto, CreateReplayDto, CreateRuleInput, CreateTargetInput, PublishEventDto } from "./event-bridge.dto";
import { startOf, endOf } from "src/hbs/helpers";

@Controller('event-bridge')
export class EventBridgeController {

    constructor(private readonly service: EventBridgeService) {}

    @Get()
    @Render('event-bridge-list')
    async root() {
        const { EventBuses } = await this.service.listEventBuses();
        const { Archives } = await this.service.listArchives();

        return { EventBuses, Archives };
    }

    @Get('create-rule')
    @Render('event-bridge-create-rule')
    async getCreateEventRule(@Query('name') eventBusName: string) {
        return { eventBusName };
    }

    @Post('create-rule')
    async createEventRule(@Res() res: Response, @Body() input: CreateRuleInput) {
        const result = await this.service.createEventRule(
            input.name, 
            input.description, 
            input.scheduleExpression,
            input.eventBusname,
            input.eventPattern,            
        );
        return res.redirect(302, `/event-bridge/bus-details?name=${input.eventBusname}`);
    }

    @Post('create-target')
    async createTarget(@Res() res: Response, @Body() input: CreateTargetInput) {
        const result = await this.service.createTarget(input.rule, input.eventBusName, input.targets);
        return res.redirect(302, `/event-bridge/rule-details?name=${input.rule}&eventBusName=${input.eventBusName}`);
    }

    @Get('delete-rule')
    async deleteRule(@Res() res: Response, @Query('ruleName') ruleName: string, @Query('eventBusName') eventBusName: string) {
        const result = await this.service.deleteRule(eventBusName, ruleName);
        return res.redirect(302, `/event-bridge/bus-details?name=${eventBusName}`);
    }

    @Get('rule-details')
    @Render('rule-details')
    async getRuleDetails(
        @Res() res: Response, 
        @Query('name') name: string,
        @Query('eventBusName') eventBusName: string,
    ) {
        const details = await this.service.describeRule(name, eventBusName);
        delete details.$metadata;
        const targets = await this.service.listTargets(name, eventBusName);
        return { name, eventBusName, details, Targets: targets.Targets };
    }

    @Get('delete-target')
    async deleteTarget(
        @Res() res: Response, 
        @Query('rule') rule: string, 
        @Query('id') id: string,
        @Query('eventBusName') eventBusName: string,
    ) {
        const result = await this.service.deleteTarget(eventBusName, rule, id);
        return res.redirect(302, `/event-bridge/rule-details?name=${rule}&eventBusName=${eventBusName}`);
    }

    @Get('create-bus')
    @Render('event-bridge-create-bus')
    async getCreateBus() {
        return {};
    }

    @Get('bus-details')
    @Render('event-bridge-bus-details')
    async getBusDetails(@Query('name') name: string) {
        const { Rules } = await this.service.getRulesList(name);
        return { name, Rules };
    }

    @Get('delete-bus')
    @Redirect('/event-bridge', 302)
    async deleteBus(@Query('name') name: string) {
        const result = await this.service.removeEventBus(name);
        return null;
    }

    @Post('create-bus')
    @Redirect('/event-bridge', 302)
    async createEventBus(@Body() input: CreateEventBusDto) {
        const result = await this.service.createEventBus(input.name, input.description);
        return result;
    }

    @Get('archive')
    @Render('event-bridge-archive')
    async getArchive() {
        return {};
    }

    @Post('archive')
    @Redirect('/event-bridge', 302)
    async createArchive(@Body() input: CreateEventArchiveDto) {
        const result = await this.service.createArchive(
            input.archiveName,
            input.description,
            input.eventSourceArn,
            parseInt(input.retentionDays, 10)
        );
        return result;
    }

    @Get('delete-archive')
    @Redirect('/event-bridge', 302)
    async deleteArchive(@Query('name') name: string) {
        const result = await this.service.deleteArchive(name);
        return result;
    }

    @Get('archive-details')
    @Render('event-bridge-archive-details')
    async getArchiveDetails(@Query('name') archiveName: string) {
        const { $metadata, ...details } = await this.service.getArchiveDetails(archiveName);
        return { archiveName, details };
    }

    @Get('publish-event')
    @Render('event-bridge-publish-event')
    async getPublishEvent() {
        return {};
    }

    @Post('publish-event')
    @Redirect('/event-bridge', 302)
    async publishEvent(@Body() input: PublishEventDto) {
        const result = await this.service.putEvent(
            input.eventBusName,
            input.source,
            input.detailType,
            input.detail
        );
        return result;
    }

    @Post('start-replay')
    async createReplay(
        @Res() res: Response,
        @Body() input: CreateReplayDto,
    ) {
        const today = new Date();
        const startTime = startOf(today);
        const endTime = endOf(today);

        const result = await this.service.startReplay(
            input.replayName, 
            input.sourceArn, 
            input.destinationArn, 
            startTime, 
            endTime,
        );

        res.redirect(302, `/event-bridge/archive-details?name=${input.archiveName}`);
    }

}
