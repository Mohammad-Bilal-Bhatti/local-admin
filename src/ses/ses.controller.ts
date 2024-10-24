import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { SesService } from "./ses.service";
import { CreateTemplateDto, SendEmailDto, VerifyDomainDto, VerifyEmailDto } from "./ses.dto";
import { Response } from 'express';


@Controller('ses')
export class SesController {
    constructor (private readonly service: SesService) {}

    @Get()
    @Render('ses-list')
    async root(
        @Query('messageId') messageId: string, 
        @Query('tab') tab = 'identities', 
    ) {
        const { Identities } = await this.service.listIdentities();
        const { TemplatesMetadata } = await this.service.listTemplates();        
        const { SendDataPoints } = await this.service.getStatistics();

        return { tab, Identities, messageId, TemplatesMetadata, SendDataPoints };
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

    @Get('create-template')
    @Render('ses-create-template')
    async getCreateTemplate() {
        return {};
    }

    @Post('create-template')
    @Redirect('/ses', 302)
    async createTemplate(@Body() input: CreateTemplateDto) {
        const result = await this.service.createTemplate(input.templateName, input.subject, input.text, input.html);
        return result;
    }

    @Get('delete-template')
    @Redirect('/ses', 302)
    async deleteTemplate(@Query('templateName') templateName: string) {
        const result = await this.service.deleteTemplate(templateName);
        return result;
    }

}
