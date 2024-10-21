import { Body, Controller, Get, Post, Query, Redirect, Render } from "@nestjs/common";
import { CFService } from "./cf.service";
import { CreateStackDto } from "./cf.dto";

@Controller('cf')
export class CFController {

    constructor(private readonly service: CFService) {}

    @Get()
    @Render('cf-list')
    async root() {
        const { StackSummaries } = await this.service.listStacks();
        return { StackSummaries };
    }


    @Get('create-stack')
    @Render('cf-create-stack')
    async getCreateStack() {
        return {};
    }

    @Post('create-stack')
    @Redirect('/cf',302)
    async createStack(@Body() input: CreateStackDto) {
        const result = await this.service.createStack(input.name, input.templateBody);
        return result;
    }

    @Get('delete-stack')
    @Redirect('/cf',302)
    async deleteStack(@Query('stackName') stackName: string) {
        const result = await this.service.deleteStack(stackName);
        return result;
    }

    @Get('stack-details')
    @Render('cf-stack-details')
    async getStackDetails(
        @Query('stackName') stackName: string,
        @Query('tab') tab = 'details',
    ) {

        const result = { tab, stackName  }; 
        switch(tab) {
            case 'template': {
                const { TemplateBody } = await this.service.getTemplate(stackName);
                Object.assign(result, { TemplateBody: JSON.parse(TemplateBody) });
                break;
            }
            case 'events': {
                const { StackEvents } = await this.service.getStackEvents(stackName);
                Object.assign(result, { StackEvents });
                break;
            }
            case 'resources': {
                const { StackResources } = await this.service.getStackResources(stackName);
                Object.assign(result, { StackResources });
                break;
            }
            default:
            case 'details': {
                const { Stacks } = await this.service.getStackDetails(stackName);
                const details = Stacks[0];
                Object.assign(result, { details });
                break;
            }
        }

        return result;
    }

}
