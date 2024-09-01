import { Body, Controller, Get, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { SsmService } from "./ssm.service";
import { CreateParameterInput } from "./ssm.dto";

@Controller('ssm')
export class SsmController {
    constructor(private readonly ssmService: SsmService) {}

    @Get()
    @Render('ssm-list')
    async getList() {
        const parameters = await this.ssmService.getParameters();
        return { Parameters: parameters.Parameters };
    }

    @Get('create')
    @Render('ssm-create-parameter')
    async getCreatePage() {
        return null;
    }

    @Post('create')
    async createParameter(@Res() res: Response, @Body() input: CreateParameterInput) {
        const result = await this.ssmService.putParameter(input.name, input.value, input.overwrite);
        if (input.overwrite) return res.redirect(302, `/ssm/details?name=${input.name}`);
        return res.redirect(302, '/ssm');
    }

    @Get('details')
    @Render('ssm-parameter-detail')
    async getDetails(@Query('name') name: string) {
        const parameter = await this.ssmService.getParameter(name);
        const history = await this.ssmService.getParameterHistory(name);
        return { name, details: parameter.Parameter, history: history.Parameters };
    }

    @Get('remove')
    @Redirect('/ssm', 302)
    async removeParamater(@Query('name') name: string) {
        const response = await this.ssmService.removeParameter(name);
        return null;
    }

}
