import { Controller, Get, Render } from "@nestjs/common";

@Controller('cf')
export class CFController {

    @Get()
    @Render('cf-list')
    async root() {
        return {};
    }

}
