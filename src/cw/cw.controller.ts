import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { CWService } from "./cw.service";
import { ComparisonOperator, CreateLogGroupDto, CreateLogStreamDto, CreateMetricAlarmDto, LogGroupClass, PutMetricDataDto, StateValue, Statistic } from "./cw.dto";
import { Response } from 'express';
import { createOptions, endOf, startOf } from "src/hbs/helpers";

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
    async getCreateLogStream(@Query('groupName') groupName: string) {
        return { groupName };
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
        const statisticOptions = createOptions(Statistic);
        const comparisonOperatorOptions = createOptions(ComparisonOperator);
        return { statisticOptions, comparisonOperatorOptions };
    }

    @Post('create-alarm')
    @Redirect('/cw', 302)
    async createAlarm(@Body() input: CreateMetricAlarmDto) {
        const result = await this.service.createMetricAlarm(
            input.alarmName,
            input.description,
            input.metricName,
            input.comparisonOperator,
            input.evaluationPeriod,
            input.period,
            input.threshold,
            input.statistic,
            input.namespace,
            input.alarmAction,
            input.okAction,
            input.insufficientDataAction,
            input.dimensions,
        );
        return result;
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
    async createLogStream(@Res() res: Response, @Body() input: CreateLogStreamDto) {
        const result = await this.service.createLogStream(input.groupName, input.streamName);
        return res.redirect(302, `/cw/log-group-details?groupName=${input.groupName}`);
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
        @Res() res: Response,
        @Query('groupName') groupName: string,
        @Query('streamName') streamName: string,
    ) {
        const result = await this.service.deleteLogStream(groupName, streamName);
        return res.redirect(302, `/cw/log-group-details?groupName=${groupName}`);
    }

    @Get('stream-events')
    @Render('cw-stream-events')
    async getStreamEvents(
        @Query('groupName') groupName: string,
        @Query('streamName') streamName: string,
    ) {

        const { events } = await this.service.getLogEvents(groupName, streamName);
        return { events, groupName, streamName };
    }

    @Get('delete-alarm')
    @Redirect('/cw?tab=alarms', 302)
    async deleteAlarm(@Query('alarmName') alarmName: string) {
        const result = await this.service.deleteAlarm(alarmName);
        return result;
    }

    @Get('set-alarm-state')
    @Redirect('/cw?tab=alarms', 302)
    async setAlarmState(@Query('alarmName') alarmName: string, @Query('stateReason') stateReason: string, @Query('value') value: StateValue) {
        const result = await this.service.setAlarmState(alarmName, stateReason, value);
        return result;
    }

    @Get('metric-details')
    @Render('cw-metric-details')
    async getMetricDetails(
        @Query('metricName') metricName: string, 
        @Query('namespace') namespace: string,
        @Query('tab') tab = 'data-points',
    ) {

        const now = new Date();
        const start = startOf(now);
        const end = endOf(now);

        const { Datapoints, Label } = await this.service.getMetricStats(namespace, metricName, start, end, 30);
        const { MetricAlarms } = await this.service.getMetricAlarms(metricName, namespace);

        return { tab, metricName, namespace, Datapoints, Label, MetricAlarms };
    }

    @Post('metric-data')
    async putMetricData(@Body() input: PutMetricDataDto, @Res() response: Response) {
        const result = await this.service.putMetricData(input.namespace, input.metricName, parseInt(input.value, 10));
        return response.redirect(302, `/cw/metric-details?metricName=${input.metricName}&namespace=${input.namespace}`);
    }

}
