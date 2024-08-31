import { KeyAlgorithm } from '@aws-sdk/client-acm';


export class GenerateCertificateDto {
    domain: string;
    algorithm: KeyAlgorithm;
}

export { KeyAlgorithm } from '@aws-sdk/client-acm';