import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { SfnService } from "./sfn.service";
import { CreateStateMachineDto, StartWorkflowDto } from "./sfn.dto";
import { Response } from 'express';

@Controller('sfn')
export class SfnController {

    constructor(private readonly service: SfnService) {}

    @Get()
    @Render('sfn-list')
    async root() {
        const { stateMachines } = await this.service.listStateMachines();
        return { stateMachines };
    }

    @Get('create-state-machine')
    @Render('sfn-create-state-machine')
    async getCreateStateMachine() {
        return {};
    }

    @Post('create-state-machine')
    @Redirect('/sfn', 302)
    async createStateMachine(@Body() input: CreateStateMachineDto) {
        const result = await this.service.createStateMachine(input.name, input.definition, input.roleArn);
        return result;
    }

    @Get('state-machine-details')
    @Render('sfn-state-machine-details')
    async getStateMachineDetails(
        @Query('arn') arn: string,
        @Query('tab') tab = 'details',
    ) {
        const { $metadata, ...details } = await this.service.describeStateMachine(arn);
        const { executions } = await this.service.listExecutions(arn);
        return { tab, stateMachineArn: arn, details, executions };
    }

    @Get('delete-state-machine')
    @Redirect('/sfn', 302)
    async deleteStateMachine(@Query('arn') arn: string) {
        const result = await this.service.deleteStateMachine(arn);
        return result;
    }

    @Post('start-execution')
    async startExecution(@Res() response: Response, @Body() input: StartWorkflowDto) {
        const result = await this.service.startExecution(input.stateMachineArn, input.input);
        return response.redirect(302, `/sfn/state-machine-details?arn=${input.stateMachineArn}`);
    }

}
