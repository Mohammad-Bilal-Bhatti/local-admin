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

export { _InstanceType } from '@aws-sdk/client-ec2'; 