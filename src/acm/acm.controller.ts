import { Body, Controller, Get, Post, Query, Redirect, Render } from "@nestjs/common";
import { AcmService } from "./acm.service";
import { GenerateCertificateDto, KeyAlgorithm } from "./acm.dto";

@Controller('acm')
export class AcmController {
    constructor (private readonly service: AcmService) {}

    @Get()
    @Render('acm-list')
    async listCertificates() {
        const list = await this.service.listCertificates();
        return { Certificates: list.CertificateSummaryList };
    }

    @Get('create')
    @Render('acm-create')
    async getCreateCertificate() {
        const algorithmOptions: { label: string, value: KeyAlgorithm }[] = [
            { label: 'EC_prime256v1', value: 'EC_prime256v1' },
            { label: 'EC_secp384r1', value: 'EC_secp384r1' },
            { label: 'EC_secp521r1', value: 'EC_secp521r1' },
            { label: 'RSA_1024', value: 'RSA_1024' },
            { label: 'RSA_2048', value: 'RSA_2048' },
            { label: 'RSA_3072', value: 'RSA_3072' },
            { label: 'RSA_4096', value: 'RSA_4096' },
        ];

        return { algorithmOptions };
    }

    @Post('create')
    @Redirect('/acm', 302)
    async createCertificate(
        @Body() input: GenerateCertificateDto,
    ) {
        const result = await this.service.generateCertificate(input.domain, input.algorithm);
        return null;
    }

    @Get('details')
    @Render('acm-details')
    async getDetails(@Query('arn') arn: string) {
        const details = await this.service.getCertificateDetails(arn);
        const certificate = details.Certificate;
        const chain = details.CertificateChain;
        return { arn, certificate, chain };
    }

    @Get('delete')
    @Redirect('/acm', 302)
    async deleteCertificate(@Query('arn') arn: string) {
        const result = await this.service.deleteCertificate(arn);
        return null;
    }

    @Get('renew')
    @Redirect('/acm', 302)
    async renewCertificate(@Query('arn') arn: string) {
        const result = await this.service.renewCertificate(arn);
        return null;
    }

}
 