import { Body, Controller, Get, Post, Query, Redirect, Render } from "@nestjs/common";
import { CWService } from "./cw.service";
import { CreateLogGroupDto, CreateLogStreamDto, LogGroupClass } from "./cw.dto";

@Controller('cw')
export class CwController {
    constructor(private readonly service: CWService) {}

    @Get()
    @Render('cw-list')
    async getList(@Query('tab') tab = 'groups') {
        const result = { tab };
        switch(tab) {
            case 'metrics': {
                const { Metrics } = await this.service.listMetrics();
                Object.assign(result, { Metrics });
                break;
            }
            case 'alarms': {
                const { MetricAlarms, CompositeAlarms } = await this.service.listAlarms();                
                Object.assign(result, { MetricAlarms, CompositeAlarms });
                break;
            }
            default:
            case 'groups': {
                const { logGroups, } = await this.service.listLogGroups();
                Object.assign(result, { logGroups });
                break;
            }
        }

        return result;
    }

    @Get('create-metric')
    @Render('cw-create-metric')
    async getCreateMetric() {
        return null;
    }

    @Get('create-log-stream')
    @Render('cw-create-log-stream')
    async getCreateLogStream() {
        return null;
    }

    @Get('log-group-details')
    @Render('cw-log-group-details')
    async getLogGroupDetails(@Query('groupName') groupName: string) {
        const { logStreams } = await this.service.listLogStreams(groupName);
        return { groupName, logStreams };
    }
    
    @Get('create-alarm')
    @Render('cw-create-alarm')
    async getCreateAlarm() {
        return null;
    }

    @Get('create-log-group')
    @Render('cw-create-log-group')
    async getCreateLogGroup() {
        const logGroupOptions = Object.keys(LogGroupClass).map(key => ({ label: key, value: LogGroupClass[key] }))
        return { logGroupOptions };
    }

    @Post('create-log-group')
    @Redirect('/cw', 302)
    async createLogGroup(@Body() input: CreateLogGroupDto) {
        const result = await this.service.createLogGroup(input.groupName, input?.kmsKeyId, input?.logGroupClass);
        result
    }

    @Post('create-log-stream')
    @Redirect('/cw', 302)
    async createLogStream(@Body() input: CreateLogStreamDto) {
        const result = await this.service.createLogStream(input.groupName, input.streamName);
        return result;
    }

    @Get('delete-log-group')
    @Redirect('/cw', 302)
    async deleteLogGroup(@Query('groupName') groupName: string) {
        const result = await this.service.deleteLogGroup(groupName);
        return result;
    }

    @Get('delete-log-stream')
    @Redirect('/cw', 302)
    async deleteLogStreamGroup(
        @Query('groupName') groupName: string,
        @Query('streamName') streamName: string,
    ) {
        const result = await this.service.deleteLogStream(groupName, streamName);
        return result;
    }

}
