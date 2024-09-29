import { Controller, Get, Render } from "@nestjs/common";
import { KinesisService } from "./kinesis.service";

@Controller('kinesis')
export class KinesisController {
    constructor(private readonly service: KinesisService) {}

    @Get()
    @Render('kinesis-list')
    async getList() {
        return null;
    }
}
