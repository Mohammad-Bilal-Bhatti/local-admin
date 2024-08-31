import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { SsmService } from "./ssm.service";
import { CreateParameterInput } from "src/dtos/ssm.dto";

@Controller('ssm')
export class SsmController {
    constructor(private readonly ssmService: SsmService) {}

    @Get()
    async getList(@Res() res: Response) {
        const parameters = await this.ssmService.getParameters();
        return res.render('ssm-list', { Parameters: parameters.Parameters });
    }

    @Get('create')
    async getCreatePage(@Res() res: Response) {
        return res.render('ssm-create-parameter');
    }

    @Post('create')
    async createParameter(@Res() res: Response, @Body() input: CreateParameterInput) {
        const response = await this.ssmService.putParameter(input.name, input.value, input.overwrite);
        if (input.overwrite) return res.redirect(302, `/ssm/details?name=${input.name}`);
        return res.redirect(302, '/ssm');
    }

    @Get('details')
    async getDetails(@Res() res: Response, @Query('name') name: string) {
        const parameter = await this.ssmService.getParameter(name);
        const history = await this.ssmService.getParameterHistory(name);
        return res.render('ssm-parameter-detail', { name, details: parameter.Parameter, history: history.Parameters });
    }

    @Get('remove')
    async removeParamater(
        @Res() res: Response, 
        @Query('name') name: string
    ) {
        const response = await this.ssmService.removeParameter(name);
        return res.redirect(302, '/ssm');
    }

}
