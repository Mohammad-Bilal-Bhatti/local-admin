import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { EventBridgeService } from "./event-bridge.service";
import { CreateRuleInput, CreateTargetInput } from "src/dtos/event-bridge.dto";

@Controller('event-bridge')
export class EventBridgeController {

    constructor(private readonly service: EventBridgeService) {}

    @Get()
    async getRulesList(@Res() res: Response) {
        const rules = await this.service.getRulesList();
        return res.render('event-bridge-list', { Rules: rules?.Rules });
    }

    @Get('create-rule')
    async getCreateEventRule(@Res() res: Response) {
        return res.render('event-bridge-create-rule', { });
    }

    @Post('create-rule')
    async createEventRule(@Res() res: Response, @Body() input: CreateRuleInput) {
        const result = await this.service.createEventRule(input.name, input.description, input.scheduleExpression);
        return res.redirect(302, '/event-bridge');
    }

    @Post('create-target')
    async createTarget(@Res() res: Response, @Body() input: CreateTargetInput) {
        const result = await this.service.createTarget(input.rule, input.targets);
        return res.redirect(302, `/event-bridge/rule-details?name=${input.rule}`);
    }

    @Get('delete-rule')
    async deleteRule(@Res() res: Response, @Query('name') name: string) {
        const result = await this.service.deleteRule(name);
        return res.redirect(302, '/event-bridge');
    }

    @Get('rule-details')
    async getRuleDetails(@Res() res: Response, @Query('name') name: string) {
        const details = await this.service.describeRule(name);
        delete details.$metadata;
        const targets = await this.service.listTargets(name);
        return res.render('rule-details', { name, details, Targets: targets.Targets });
    }

    @Get('delete-target')
    async deleteTarget(@Res() res: Response, @Query('rule') rule: string, @Query('id') id: string) {
        const result = await this.service.deleteTarget(rule, id);
        return res.redirect(302, `/event-bridge/rule-details?name=${rule}`);
    }

}
