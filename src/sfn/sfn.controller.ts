import { Controller, Get, Render } from "@nestjs/common";
import { SfnService } from "./sfn.service";

@Controller('sfn')
export class SfnController {

    constructor(private readonly service: SfnService) {}

    @Get()
    @Render('sfn-list')
    async root() {
        return {};
    }

}
