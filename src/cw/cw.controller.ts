import { Controller, Get, Render } from "@nestjs/common";
import { CWService } from "./cw.service";

@Controller('cw')
export class CwController {
    constructor(private readonly service: CWService) {}

    @Get()
    @Render('cw-list')
    async getList() {
        return null;
    }

}
