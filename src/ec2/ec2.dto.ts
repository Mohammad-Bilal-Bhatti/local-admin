import { _InstanceType } from '@aws-sdk/client-ec2'

export class LaunchInstanceDto {
    imageId: string;
    instanceType: _InstanceType;
    keyName: string;
    securityGroups: string;
    userData: string;
}

export class CreateKeysDto {
    name: string;
}

export class CreateSecuirtyGroupDto {
    name: string;
    description: string;
}

export class AddIngressRuleDto {
    groupId: string;
    cidrIp: string;
    fromPort: number;
    toPort: number;
    ipProtocol: string;
}

export class AddEgressRuleDto {
    groupId: string;
    cidrIp: string;
    fromPort: number;
    toPort: number;
    ipProtocol: string;
}

export { _InstanceType } from '@aws-sdk/client-ec2'; 