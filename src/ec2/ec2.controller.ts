import { Body, Controller, Get, Post, Query, Redirect, Render } from "@nestjs/common";
import { Ec2Service } from "./ec2.service";
import { LaunchInstanceDto, CreateKeysDto, _InstanceType } from "./ec2.dto";

@Controller('ec2')
export class Ec2Controller {
    constructor(private readonly service: Ec2Service){}

    @Get()
    @Render('ec2-list')
    async getList() {
        const { Images } = await this.service.listImages();
        const { Reservations: [ { Instances } ] } = await this.service.listInstances();
        const { KeyPairs } = await this.service.listKeys();
        return { Images, Instances, KeyPairs };
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

}
