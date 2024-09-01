import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { EventBridgeService } from "./event-bridge.service";
import { CreateRuleInput, CreateTargetInput } from "./event-bridge.dto";

@Controller('event-bridge')
export class EventBridgeController {

    constructor(private readonly service: EventBridgeService) {}

    @Get()
    @Render('event-bridge-list')
    async getRulesList() {
        const rules = await this.service.getRulesList();
        return { Rules: rules?.Rules };
    }

    @Get('create-rule')
    @Render('event-bridge-create-rule')
    async getCreateEventRule() {
        return null;
    }

    @Post('create-rule')
    @Redirect('/event-bridge', 302)
    async createEventRule(@Body() input: CreateRuleInput) {
        const result = await this.service.createEventRule(input.name, input.description, input.scheduleExpression);
        return null;
    }

    @Post('create-target')
    async createTarget(@Res() res: Response, @Body() input: CreateTargetInput) {
        const result = await this.service.createTarget(input.rule, input.targets);
        return res.redirect(302, `/event-bridge/rule-details?name=${input.rule}`);
    }

    @Get('delete-rule')
    @Redirect('/event-bridge', 302)
    async deleteRule(@Res() res: Response, @Query('name') name: string) {
        const result = await this.service.deleteRule(name);
        return null;
    }

    @Get('rule-details')
    @Render('rule-details')
    async getRuleDetails(@Res() res: Response, @Query('name') name: string) {
        const details = await this.service.describeRule(name);
        delete details.$metadata;
        const targets = await this.service.listTargets(name);
        return { name, details, Targets: targets.Targets };
    }

    @Get('delete-target')
    async deleteTarget(@Res() res: Response, @Query('rule') rule: string, @Query('id') id: string) {
        const result = await this.service.deleteTarget(rule, id);
        return res.redirect(302, `/event-bridge/rule-details?name=${rule}`);
    }

}
