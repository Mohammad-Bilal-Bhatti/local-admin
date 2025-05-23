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
    ListTemplatesCommand,
    ListTemplatesCommandOutput,
    CreateTemplateCommand,
    CreateTemplateCommandOutput,
    DeleteTemplateCommand,
    DeleteTemplateCommandOutput,
    SendTemplatedEmailCommand,
    SendTemplatedEmailCommandOutput,
    CreateReceiptRuleCommand,
    CreateReceiptRuleCommandOutput,
    GetSendStatisticsCommand,
    GetSendStatisticsCommandOutput
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

    async listTemplates(): Promise<ListTemplatesCommandOutput> {
        const command = new ListTemplatesCommand({});
        const result = await this.client.send(command);
        return result;
    }

    async createTemplate(templateName: string, subject: string, text: string, html: string): Promise<CreateTemplateCommandOutput> {
        const command = new CreateTemplateCommand({
            Template: {
                TemplateName: templateName,
                SubjectPart: subject,
                HtmlPart: html,
                TextPart: text,
            }
        });
        const result = await this.client.send(command);
        return result;
    }

    async deleteTemplate(templateName: string): Promise<DeleteTemplateCommandOutput> {
        const command = new DeleteTemplateCommand({
            TemplateName: templateName
        });
        const result = await this.client.send(command);
        return result;
    }

    async sendTemplateEmail(templateName: string, fromEmail: string, toEmail: string, templateData: string): Promise<SendTemplatedEmailCommandOutput> {
        const command = new SendTemplatedEmailCommand({
            Template: '',
            Destination: {
                ToAddresses: [
                    toEmail,
                ],
            },
            Source: fromEmail,
            TemplateData: templateData,

        });
        const result = await this.client.send(command);
        return result;
    }

    async createRecriptRule(): Promise<CreateReceiptRuleCommandOutput> {
        /* TODO: will do it later */
        const command = new CreateReceiptRuleCommand({
            Rule: {
                Name: '',
                Recipients: ['match@domain.com'],
                Enabled: true,
                Actions: [
                    {
                        S3Action: {
                            BucketName: '',
                            ObjectKeyPrefix: '',
                        }
                    },
                ],
            },
            RuleSetName: ''
        });
        const result = await this.client.send(command);
        return result;
    }

    async getStatistics(): Promise<GetSendStatisticsCommandOutput> {
        const command = new GetSendStatisticsCommand();
        const result = await this.client.send(command);
        return result;
    }

}
