import { Controller, Get, Render } from "@nestjs/common";

@Controller('route53')
export class Route53Controller {

    @Get()
    @Render('route53-list')
    async root() {
        return {};
    }
}
