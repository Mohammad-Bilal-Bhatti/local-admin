import { Body, Controller, Get, Post, Query, Redirect, Render } from "@nestjs/common";
import { Ec2Service } from "./ec2.service";
import { LaunchInstanceDto, CreateKeysDto, _InstanceType, CreateSecuirtyGroupDto, AddIngressRuleDto, AddEgressRuleDto } from "./ec2.dto";

@Controller('ec2')
export class Ec2Controller {
    constructor(private readonly service: Ec2Service){}

    @Get()
    @Render('ec2-list')
    async getList(@Query('tab') tab = 'key-pairs') {

        const data = { tab };
        switch(tab) {
            case 'sg': {
                const { SecurityGroups } = await this.service.listSecurityGroups();
                Object.assign(data, { SecurityGroups });
                break;
            }
            case 'images': {
                const { Images } = await this.service.listImages();
                Object.assign(data, { Images });
                break;
            }
            case 'instances': {
                const { Reservations } = await this.service.listInstances();
                const { Instances } = Reservations[0] || {};
                Object.assign(data, { Instances });
                break;
            }

            default:
            case 'keys': {
                const { KeyPairs } = await this.service.listKeys();
                Object.assign(data, { KeyPairs });
                break;
            }
        }

        return data;
    }

    @Get('launch')
    @Render('ec2-launch')
    async getLaunchInstance() {
        const instanceTypes = Object.values(_InstanceType).map(item => ({ label: item, value: item }));
        return { instanceTypes };
    }

    @Post('launch')
    @Redirect('/ec2', 302)
    async launchInstance(@Body() input: LaunchInstanceDto) {
        const result = await this.service.runInstance(
            input.imageId,
            input.instanceType,
            input.keyName,
            input.securityGroups,
            input.userData
        );
        return null;
    }

    @Get('create-keys')
    @Render('ec2-create-keys')
    async getCreateKeys() {
        return null;
    }

    @Post('create-keys')
    @Render('ec2-create-keys-result')
    async createKeysResult(@Body() input: CreateKeysDto) {
        const result = await this.service.createKeyPair(input.name);
        const { KeyFingerprint, KeyMaterial, KeyName, KeyPairId } = result;
        return { KeyFingerprint, KeyMaterial, KeyName, KeyPairId };
    }

    @Get('remove-key')
    @Redirect('/ec2', 302)
    async getRemoveKey(@Query('name') name: string) {
        const result = await this.service.removeKey(name);
        return null;
    }

    @Get('start-instance')
    @Redirect('/ec2', 302)
    async startInstance(@Query('instanceId') instanceId: string) {
        const result = await this.service.startInstances([instanceId]);
        return null;
    }

    @Get('stop-instance')
    @Redirect('/ec2', 302)
    async stopInstance(@Query('instanceId') instanceId: string) {
        const result = await this.service.stopInstances([instanceId]);
        return null;
    }

    @Get('terminate-instance')
    @Redirect('/ec2', 302)
    async terminateInstance(@Query('instanceId') instanceId: string) {
        const result = await this.service.terminateInstances([instanceId]);
        return null;
    }

    @Get('instance-details')
    @Render('ec2-instance-detail')
    async getInstanceDetails(@Query('instanceId') instanceId: string) {
        const instance = await this.service.getInstanceDetails(instanceId);
        return { instance };
    }

    @Get('details-sg')
    @Render('ec2-details-sg')
    async getSgDetails(
        @Query('groupId') groupId: string,
        @Query('tab') tab = 'ingress',
    ) {

        const securityGroup = await this.service.getSecurityGroup(groupId);
        const { IpPermissions, IpPermissionsEgress, ...rest } =  securityGroup;
        return { groupId, tab, IpPermissions, IpPermissionsEgress, details: rest };
    }

    @Get('create-sg')
    @Render('ec2-create-sg')
    async getCreateSecurityGroup() {
        return {};
    }

    @Post('create-sg')
    @Redirect('/ec2', 302)
    async createSecurityGroup(@Body() input: CreateSecuirtyGroupDto) {
        const response = await this.service.createSecurityGroup(input.name, input.description);
        return null;
    }

    @Post('add-ingress')
    @Redirect('/ec2', 302)
    async addIngressRule(@Body() input: AddIngressRuleDto) {
        const response = await this.service.addIngressRule(input.groupId, input.cidrIp, input.fromPort, input.toPort, input.ipProtocol);
        return null;
    }

    @Post('add-egress')
    @Redirect('/ec2', 302)
    async addEgressRule(@Body() input: AddEgressRuleDto) {
        const response = await this.service.addEgressRule(input.groupId, input.cidrIp, input.fromPort, input.toPort, input.ipProtocol);
        return null;
    }

}
