import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigureInput } from "src/app.dto";
import { ConfigurableService } from "src/shared/configurable.interface";
import { 
    SESClient,
    ListIdentitiesCommand,
    ListIdentitiesCommandOutput,
    VerifyEmailIdentityCommand,
    VerifyEmailIdentityCommandOutput,
    SendEmailCommand,
    SendEmailCommandOutput,
    DeleteIdentityCommand,
    DeleteIdentityCommandOutput,
    VerifyDomainIdentityCommand,
    VerifyDomainIdentityCommandOutput,
} from "@aws-sdk/client-ses";

@Injectable()
export class SesService implements ConfigurableService {

    private client: SESClient;
    constructor(private readonly configService: ConfigService) {
        this.client = new SESClient({
            endpoint: this.configService.get<string>('localstack.endpoint'),
            region: this.configService.get<string>('localstack.region'),
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new SESClient({
            endpoint: configuration.endpoint,
            region: configuration.region,
        });
    }

    async listIdentities(): Promise<ListIdentitiesCommandOutput> {
        const command = new ListIdentitiesCommand({});
        const result = await this.client.send(command);
        return result;
    }

    async deleteIdentity(identity: string): Promise<DeleteIdentityCommandOutput> {
        const command = new DeleteIdentityCommand({
            Identity: identity
        });
        const result = await this.client.send(command);
        return result;
    }

    async verifyEmailIdentity(email: string): Promise<VerifyEmailIdentityCommandOutput> {
        const command = new VerifyEmailIdentityCommand({
            EmailAddress: email
        });
        const result = await this.client.send(command);
        return result;
    }

    async sendEmail(fromEmail: string, toEmail: string, subject: string, body: string): Promise<SendEmailCommandOutput> {
        const command = new SendEmailCommand({
            Source: fromEmail,
            Destination: {
                ToAddresses: [toEmail],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: {
                        Data: body,
                    },
                    Html: {
                        Data: body,
                    },
                }
            },
        });
        const result = await this.client.send(command);
        return result;
    }

    async verifyDomainIdentity(domain: string): Promise<VerifyDomainIdentityCommandOutput> {
        const command = new VerifyDomainIdentityCommand({
            Domain: domain
        });
        const result = await this.client.send(command);
        return result;
    }

}
