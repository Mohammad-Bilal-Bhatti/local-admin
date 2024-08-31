import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { Response, Request } from 'express';
import { SnsService } from "./sns.service";
import { ConfirmSubscriptionInput, CreateTopicInput, PublishMessageInput, SubscribeTopicInput } from "src/dtos/sns.input.dto";

@Controller('sns')
export class SnsController {

    constructor(private readonly snsService: SnsService) {}

    @Get()
    async getList(@Res() res: Response) {
        const topics = await this.snsService.getTopicsList();
        const subscriptions = await this.snsService.listSubscriptions();
        return res.render('sns-list', { Topics: topics.Topics, Subscriptions: subscriptions.Subscriptions });
    }

    @Get('create')
    async getCreateSnsTopic(@Res() res: Response) {
        return res.render('sns-create-topic', {});
    }

    @Post('create')
    async createSnsTopic(@Res() res: Response, @Body() input: CreateTopicInput) {  
        const result = await this.snsService.createTopic(input.name, input.tags);
        return res.render('sns-create-topic', { success: `Topic created with arn: ${result.TopicArn}` });
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
        const result = await this.snsService.subscribeTopic(input.topicArn, input.endpoint);
        const token = await this.snsService.lookupSubscriptionToken(result.SubscriptionArn);
        return res.redirect(302, `/sns/details?arn=${input.topicArn}&subscribed=${result.SubscriptionArn}&token=${token}`);
    }

    @Get('unsubscribe')
    async unsubscribeTopic(
        @Query('subscriptionArn') subscriptionArn: string,
        @Res() res: Response,
    ) {
        const result = await this.snsService.unsubscribeTopic(subscriptionArn);
        return res.redirect(302, '/sns');
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
    async removeTopic(
        @Query('arn') arn: string,
        @Res() res: Response,
    ) {
        const result = await this.snsService.removeTopic(arn);
        return res.redirect(302, '/sns');
    }

    @Get('details')
    async getTopicDetails(
        @Res() res: Response,
        @Query('arn') arn: string,
        @Query('published') published: string,
        @Query('subscribed') subscribed: string,
        @Query('token') token: string,
    ) {

        const sampleEndpoint = 'https://webhook.site/{{uuid}}';
        const result = await this.snsService.getTopicDetails(arn);
        return res.render('sns-topic-detail', { TopicArn: arn, Attributes: result.Attributes, token, published, subscribed, sampleEndpoint });
    }

}
