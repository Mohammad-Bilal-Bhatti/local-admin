

export class VerifyEmailDto {
    email: string;
}

export class VerifyDomainDto {
    domain: string;
}

export class SendEmailDto {
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
}
