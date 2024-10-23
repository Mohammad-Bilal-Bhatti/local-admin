import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { SesService } from "./ses.service";
import { SendEmailDto, VerifyDomainDto, VerifyEmailDto } from "./ses.dto";
import { Response } from 'express';


@Controller('ses')
export class SesController {
    constructor (private readonly service: SesService) {}

    @Get()
    @Render('ses-list')
    async root(@Query('messageId') messageId: string) {
        const { Identities } = await this.service.listIdentities();
        return { Identities, messageId };
    }

    @Get('verify-email')
    @Render('ses-verify-email')
    async getVerifyEmail() {
        return {};
    }

    @Post('verify-email')
    @Redirect('/ses', 302)
    async verifyEmail(@Body() input: VerifyEmailDto) {
        const result = await this.service.verifyEmailIdentity(input.email);
        return result;
    }

    @Get('send-email')
    @Render('ses-send-email')
    async getSendEmail() {
        return {};
    }

    @Get('delete-identity')
    @Redirect('/ses', 302)
    async deleteIdentity(@Query('identity') identity: string) {
        const result = await this.service.deleteIdentity(identity);
        return result;
    }

    @Post('send-email')
    async sendEmail(@Res() res: Response, @Body() input: SendEmailDto) {
        const result = await this.service.sendEmail(
            input.fromEmail,
            input.toEmail,
            input.subject,
            input.body,
        );
        const { MessageId } = result;
        return res.redirect(302, `/ses?messageId=${MessageId}`);
    }

    @Get('verify-domain')
    @Render('ses-verify-domain')
    async getVerifyDomain() {
        return {};
    }

    @Post('verify-domain')
    @Redirect('/ses', 302)
    async verifyDomain(@Body() input: VerifyDomainDto) {
        const result = await this.service.verifyDomainIdentity(input.domain);
    }

}
