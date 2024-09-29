import { Body, Controller, Get, Post, Query, Redirect, Render } from "@nestjs/common";
import { KinesisService } from "./kinesis.service";
import { CreateShardDto } from "./kinesis.dto";

@Controller('kinesis')
export class KinesisController {
    constructor(private readonly service: KinesisService) {}

    @Get()
    @Render('kinesis-list')
    async getList() {
        const { StreamNames } = await this.service.listStreams();
        return { StreamNames };   
    }

    @Get('create-stream')
    @Render('kinesis-create-stream')
    async getCreateStream() {
        return null;
    }

    @Post('create-stream')
    @Redirect('/kinesis', 302)
    async createStram(@Body() input: CreateShardDto) {
        const result = await this.service.createStream(input.streamName, input.shardCount);
        return null;
    }

    @Get('details')
    @Render('kinesis-details')
    async getStreamDetails(@Query('streamName') streamName: string) {
        const { StreamDescription } = await this.service.describeStream(streamName);
        return { StreamDescription };
    }

    @Get('delete')
    @Redirect('/kinesis', 302)
    async deleteStream(@Query('streamName') streamName: string) {
        const result = await this.service.deleteStream(streamName);
        return null;
    }

}
