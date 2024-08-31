import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { AcmService } from "./acm.service";
import { Response } from 'express';
import { GenerateCertificateDto, KeyAlgorithm } from "src/dtos/acm.dto";

@Controller('acm')
export class AcmController {
    constructor (private readonly service: AcmService) {}

    @Get()
    async listCertificates(@Res() res: Response) {
        const list = await this.service.listCertificates();
        return res.render('acm-list', { Certificates: list.CertificateSummaryList });
    }

    @Get('create')
    async getCreateCertificate(@Res() res: Response) {
        const algorithmOptions: { label: string, value: KeyAlgorithm }[] = [
            { label: 'EC_prime256v1', value: 'EC_prime256v1' },
            { label: 'EC_secp384r1', value: 'EC_secp384r1' },
            { label: 'EC_secp521r1', value: 'EC_secp521r1' },
            { label: 'RSA_1024', value: 'RSA_1024' },
            { label: 'RSA_2048', value: 'RSA_2048' },
            { label: 'RSA_3072', value: 'RSA_3072' },
            { label: 'RSA_4096', value: 'RSA_4096' },
        ];

        return res.render('acm-create', { algorithmOptions });
    }

    @Post('create')
    async createCertificate(
        @Res() res: Response,
        @Body() input: GenerateCertificateDto,
    ) {
        console.log("input: ", input);
        const result = await this.service.generateCertificate(input.domain, input.algorithm);        
        return res.redirect(302, '/acm');
    }

    @Get('details')
    async getDetails(@Res() res: Response, @Query('arn') arn: string) {
        const details = await this.service.getCertificateDetails(arn);
        const certificate = details.Certificate;
        const chain = details.CertificateChain;
        return res.render('acm-details', { arn, certificate, chain });
    }

    @Get('delete')
    async deleteCertificate(@Res() res: Response, @Query('arn') arn: string) {
        const result = await this.service.deleteCertificate(arn);
        return res.redirect(302, '/acm')
    }

    @Get('renew')
    async renewCertificate(@Res() res: Response, @Query('arn') arn: string) {
        const result = await this.service.renewCertificate(arn);
        console.log('result: ', result);
        return res.redirect(302, '/acm');
    }

}
 