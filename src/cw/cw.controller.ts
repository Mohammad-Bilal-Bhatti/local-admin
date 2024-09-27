import { Body, Controller, Get, Post, Query, Redirect, Render } from "@nestjs/common";
import { CWService } from "./cw.service";
import { CreateLogGroupDto, LogGroupClass } from "./cw.dto";

@Controller('cw')
export class CwController {
    constructor(private readonly service: CWService) {}

    @Get()
    @Render('cw-list')
    async getList(@Query('tab') tab = 'metrics') {
        const result = { tab };
        switch(tab) {
            case 'loggroup': {
                const { logGroups } = await this.service.listLogGroups();
                console.log(logGroups);
                Object.assign(result, { logGroups });
                break;
            }
            case 'alarms': {
                const { MetricAlarms, CompositeAlarms } = await this.service.listAlarms();

                console.log(MetricAlarms);
                console.log(CompositeAlarms);
                
                Object.assign(result, { MetricAlarms, CompositeAlarms });

                break;
            }
            default:
            case 'metrics': {
                const { Metrics } = await this.service.listMetrics();
                console.log(Metrics);

                Object.assign(result, { Metrics });
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
        return null;
    }

}
