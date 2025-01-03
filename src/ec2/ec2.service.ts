import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
    _InstanceType,
    EC2Client,
    VolumeType,
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
    CreateSecurityGroupCommand,
    CreateSecurityGroupCommandOutput,
    AuthorizeSecurityGroupIngressCommand,
    AuthorizeSecurityGroupIngressCommandOutput,
    AuthorizeSecurityGroupEgressCommand,
    AuthorizeSecurityGroupEgressCommandOutput,
    RebootInstancesCommand,
    RebootInstancesCommandOutput,
    CreateVolumeCommand,
    CreateVolumeCommandOutput,
} from "@aws-sdk/client-ec2";
import { ConfigurableService } from "src/shared/configurable.interface";
import { ConfigureInput } from "src/app.dto";

@Injectable()
export class Ec2Service implements ConfigurableService {
    private client: EC2Client;
    constructor(private readonly configService: ConfigService) {
        this.client = new EC2Client({
            endpoint: configService.get<string>('localstack.endpoint'),
            region: configService.get<string>('localstack.region')
        });
    }

    configure(configuration: ConfigureInput): void {
        this.client = new EC2Client({
            endpoint: configuration.endpoint,
            region: configuration.region
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
        userData: string,
        maxCount: number,
        minCount: number,
    ): Promise<RunInstancesCommandOutput> {
        const command = new RunInstancesCommand({
            ImageId: imageId,
            MaxCount: maxCount,
            MinCount: minCount,
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

    async rebootInstances(instanceIds: string[]): Promise<RebootInstancesCommandOutput> {
        const command = new RebootInstancesCommand({
            InstanceIds: instanceIds
        });
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
        const response = await this.client.send(command);
        return response;
    }

    async getSecurityGroup(groupId: string) {
        const command = new DescribeSecurityGroupsCommand({ GroupIds: [ groupId ] });
        const response = await this.client.send(command);
        return response.SecurityGroups[0];
    }

    async createSecurityGroup(name: string, description: string): Promise<CreateSecurityGroupCommandOutput> {
        const command = new CreateSecurityGroupCommand({ GroupName: name, Description: description });
        const response = await this.client.send(command);
        return response;
    }

    async addIngressRule(groupId: string, cidrIp: string, fromPort: number, toPort: number, ipProtocol: string): Promise<AuthorizeSecurityGroupIngressCommandOutput> {
        const command = new AuthorizeSecurityGroupIngressCommand({
            GroupId: groupId,
            CidrIp: cidrIp,
            FromPort: fromPort,
            ToPort: toPort,
            IpProtocol: ipProtocol,
        });
        const response = await this.client.send(command);
        return response;
    }

    async addEgressRule(groupId: string, cidrIp: string, fromPort: number, toPort: number, ipProtocol: string): Promise<AuthorizeSecurityGroupEgressCommandOutput> {
        const command = new AuthorizeSecurityGroupEgressCommand({
            GroupId: groupId,
            CidrIp: cidrIp,
            FromPort: fromPort,
            ToPort: toPort,
            IpProtocol: ipProtocol,
        });
        const response = await this.client.send(command);
        return response;
    }

    async createVolume(az: string, encrypted: boolean, iops: number, size: number, throughput: number, type: VolumeType, multiAttach: boolean): Promise<CreateVolumeCommandOutput> {
        const command = new CreateVolumeCommand({
            AvailabilityZone: az,
            Encrypted: encrypted,
            Iops: iops,
            Size: size,
            Throughput: throughput,
            VolumeType: type,
            MultiAttachEnabled: multiAttach,
        });
        const response = await this.client.send(command);
        return response;
    }

}
