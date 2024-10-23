import { Controller, Get, Render } from "@nestjs/common";
import { SesService } from "./ses.service";

@Controller('ses')
export class SesController {
    constructor (private readonly service: SesService) {}

    @Get()
    @Render('ses-list')
    async root() {
        return {};
    }

}
