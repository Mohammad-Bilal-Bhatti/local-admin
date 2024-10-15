import { Body, Controller, Get, Post, Query, Redirect, Render, Req, Res } from "@nestjs/common";
import { Response } from 'express';
import { SnsService } from "./sns.service";
import { ConfirmSubscriptionInput, CreateTopicInput, PublishMessageInput, SubscribeTopicInput } from "./sns.input.dto";

@Controller('sns')
export class SnsController {

    constructor(private readonly snsService: SnsService) {}

    @Get()
    @Render('sns-list')
    async getList(@Query('tab') tab = 'topics') {
        const data = { tab };
        switch (tab) {
            case 'subscriptions': {
                const { Subscriptions } = await this.snsService.listSubscriptions();
                Object.assign(data, { Subscriptions });
                break;
            }
            default:
            case 'topics': {
                const { Topics } = await this.snsService.getTopicsList();
                Object.assign(data, { Topics });
                break;
            }
        }
        return data;
    }

    @Get('create')
    @Render('sns-create-topic')
    async getCreateSnsTopic() {
        return null;
    }

    @Post('create')
    @Redirect('/sns', 302)
    async createSnsTopic(@Body() input: CreateTopicInput) {  
        const result = await this.snsService.createTopic(input.name, input.tags);
        return null
    }

    @Post('publish')
    async publishMessage(
        @Res() res: Response,
        @Body() input: PublishMessageInput,
    ) {
        const result = await this.snsService.publishMessage(input.topicArn, input.message);
        return res.redirect(302, `/sns/details?arn=${input.topicArn}&published=${result.MessageId}`);
    }

    @Post('subscribe')
    async subscribeTopic(
        @Res() res: Response, 
        @Body() input: SubscribeTopicInput
    ) {
        const result = await this.snsService.subscribeTopic(input.topicArn, input.protocol, input.endpoint);
        const token = await this.snsService.lookupSubscriptionToken(result.SubscriptionArn);
        return res.redirect(302, `/sns/details?arn=${input.topicArn}&subscribed=${result.SubscriptionArn}&token=${token}`);
    }

    @Get('unsubscribe')
    @Redirect('/sns', 302)
    async unsubscribeTopic(
        @Query('subscriptionArn') subscriptionArn: string,
    ) {
        const result = await this.snsService.unsubscribeTopic(subscriptionArn);
        return null;
    }

    @Post('confirm-subscription')
    async getConfirmSubscription(
        @Res() res: Response,
        @Body() input: ConfirmSubscriptionInput,
    ) {

        const result = await this.snsService.confirmSubscription(input.topicArn, input.token);
        return res.redirect(302, `/sns/details?arn=${input.topicArn}&message=subscription%20confirmed`);
    }

    @Get('remove')
    @Redirect('/sns', 302)
    async removeTopic(
        @Query('arn') arn: string,
    ) {
        const result = await this.snsService.removeTopic(arn);
        return null;
    }

    @Get('details')
    @Render('sns-topic-detail')
    async getTopicDetails(
        @Res() res: Response,
        @Query('arn') arn: string,
        @Query('published') published: string,
        @Query('subscribed') subscribed: string,
        @Query('token') token: string,
        @Query('tab') tab = 'details'
    ) {

        const result = await this.snsService.getTopicDetails(arn);
        return { TopicArn: arn, Attributes: result.Attributes, token, published, subscribed, tab };
    }

}
