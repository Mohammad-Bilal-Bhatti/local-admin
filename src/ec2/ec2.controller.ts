import { Body, Controller, Get, Post, Redirect, Render } from "@nestjs/common";
import { Ec2Service } from "./ec2.service";
import { CreateKeysDto } from "./ec2.dto";

@Controller('ec2')
export class Ec2Controller {
    constructor(private readonly service: Ec2Service){}

    @Get()
    @Render('ec2-list')
    async getList() {
    }

    @Get('create')
    @Render('ec2-create')
    async getCreateInstance() {
        return {};
    }

    @Post('create')
    @Redirect('/ec2', 302)
    async createInstance() {
        return null;
    }

    @Get('create-keys')
    @Render('ec2-create-keys')
    async getCreateKeys() {
        return null;
    }

    @Post('create-keys')
    @Redirect('/ec2', 302)
    async createKeys(@Body() input: CreateKeysDto) {
        const result = await this.service.createKeyPair(input.name);
        return null;
    }

}
