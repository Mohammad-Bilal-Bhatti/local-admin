import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
    ACMClient, 
    ListCertificatesCommand, 
    ListCertificatesCommandOutput,
    RequestCertificateCommand,
    RequestCertificateCommandOutput,
    DeleteCertificateCommand,
    DeleteCertificateCommandOutput,
    KeyAlgorithm,
    GetCertificateCommand,
    RenewCertificateCommand,
    RenewCertificateCommandOutput,
} from "@aws-sdk/client-acm";

@Injectable()
export class AcmService {
    
    private readonly client: ACMClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new ACMClient({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region'),
        });
    }

    async listCertificates(): Promise<ListCertificatesCommandOutput> {
        const command = new ListCertificatesCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async generateCertificate(domain: string, algorithm: KeyAlgorithm): Promise<RequestCertificateCommandOutput> {
        const command = new RequestCertificateCommand({
            DomainName: domain,
            KeyAlgorithm: algorithm,
        });
        const response = await this.client.send(command);
        return response;
    }

    async deleteCertificate(arn: string): Promise<DeleteCertificateCommandOutput> {
        const command = new DeleteCertificateCommand({ CertificateArn: arn });
        const response = await this.client.send(command);
        return response;
    }

    async getCertificateDetails(arn: string) {
        const command = new GetCertificateCommand({ CertificateArn: arn });
        const response = await this.client.send(command);
        return response;
    }

    async renewCertificate(arn: string): Promise<RenewCertificateCommandOutput> {
        const command = new RenewCertificateCommand({ CertificateArn: arn });
        const response = await this.client.send(command);
        return response;
    }

}
