import { Controller, Get, Render } from "@nestjs/common";
import { GatewayService } from "./gateway.service";

@Controller('gateway')
export class GatewayController {
    constructor(private readonly service: GatewayService) {}

    @Get()
    @Render('gateway-list')
    async getList() {
        return {};
    }
}
