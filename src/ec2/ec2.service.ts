import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
    _InstanceType,
    EC2Client,
    RunInstancesCommand,
    RunInstancesCommandOutput,
    StartInstancesCommand,
    StartInstancesCommandOutput,
    StopInstancesCommand,
    StopInstancesCommandOutput,
    TerminateInstancesCommand,
    TerminateInstancesCommandOutput,
    DescribeImagesCommand,
    DescribeImagesCommandOutput,
    DescribeInstancesCommand,
    DescribeInstancesCommandOutput,
    CreateKeyPairCommand,
    CreateKeyPairCommandOutput,
    DescribeKeyPairsCommand,
    DescribeKeyPairsCommandOutput,
    DeleteKeyPairCommand,
    DeleteKeyPairCommandOutput,
    DescribeSecurityGroupsCommand,
    DescribeSecurityGroupsCommandOutput,
} from "@aws-sdk/client-ec2";

@Injectable()
export class Ec2Service {
    private readonly client: EC2Client;
    constructor(private readonly configService: ConfigService) {
        this.client = new EC2Client({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region')
        });
    }

    async listImages(): Promise<DescribeImagesCommandOutput> {
        const command = new DescribeImagesCommand({});
        const response = await this.client.send(command);
        return response;
    }

    async listInstances(): Promise<DescribeInstancesCommandOutput> {
        const command = new DescribeInstancesCommand({ });
        const response = await this.client.send(command);
        return response;
    }

    async runInstance(
        imageId: string, 
        instanceType: _InstanceType, 
        keyName: string, 
        securityGroups: string, 
        userData: string
    ): Promise<RunInstancesCommandOutput> {
        const command = new RunInstancesCommand({
            ImageId: imageId,
            MaxCount: 1,
            MinCount: 1,
            InstanceType: instanceType,
            KeyName: keyName,
            SecurityGroupIds: [securityGroups],
            UserData: userData,
        });
        const response = await this.client.send(command);
        return response;
    }

    async startInstances(instanceIds: string[]): Promise<StartInstancesCommandOutput> {
        const command = new StartInstancesCommand({ InstanceIds: instanceIds });
        const response = await this.client.send(command);
        return response;
    }

    async stopInstances(instanceIds: string[]): Promise<StopInstancesCommandOutput> {
        const command = new StopInstancesCommand({ InstanceIds: instanceIds });
        const response = await this.client.send(command);
        return response;
    }

    async terminateInstances(instanceIds: string[]): Promise<TerminateInstancesCommandOutput> {
        const command = new TerminateInstancesCommand({ InstanceIds: instanceIds });
        const response = this.client.send(command);
        return response;
    }

    async createKeyPair(name: string): Promise<CreateKeyPairCommandOutput> {
        const command = new CreateKeyPairCommand({ KeyName: name, KeyType: 'rsa', KeyFormat: 'pem' });
        const response = await this.client.send(command);
        return response;
    }

    async listKeys(): Promise<DescribeKeyPairsCommandOutput> {
        const command = new DescribeKeyPairsCommand({ });
        const response = await this.client.send(command);
        return response;
    }

    async removeKey(name: string): Promise<DeleteKeyPairCommandOutput> {
        const command = new DeleteKeyPairCommand({ KeyName: name });
        const response = await this.client.send(command);
        return response;
    }
   

    async getInstanceDetails(instanceId: string) {
        const command = new DescribeInstancesCommand({ InstanceIds: [instanceId] });
        const response = await this.client.send(command);
        const { Reservations: [ { Instances: [ instance ] } ] } = response;
        return instance;
    }

    async listSecurityGroups(): Promise<DescribeSecurityGroupsCommandOutput> {
        const command = new DescribeSecurityGroupsCommand({});
        const response = this.client.send(command);
        return response;
    }

}
