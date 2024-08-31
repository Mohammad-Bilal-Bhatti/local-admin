import { Body, Controller, Get, ParseIntPipe, Post, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { SqsService } from "./sqs.service";
import { CreateQueueInput, DeleteMessageInput, SendMessageInput } from "src/dtos/sqs.input.dto";

@Controller('sqs')
export class SqsController {

    constructor(private readonly service: SqsService) {}

    @Get()
    async queues(
      @Res() res: Response,
      @Query('limit', new ParseIntPipe({ optional: true })) limit = 100,
    ) {
      const { data, nextToken } = await this.service.listQueues(limit);
      data.map(queue => {
        const dlqRegex = /dlq/ig;
        queue['isDLQ'] = dlqRegex.test(queue.name);
      });
  
      return res.render('sqs-list', { queues: data, nextToken });
    }

    @Get('create')
    async getCreateQueue(@Res() res: Response) {
      return res.render('sqs-create-queue', { name: "Hello World" });
    }
  
    @Post('create')
    async createQueue(
      @Res() res: Response,
      @Body() input: CreateQueueInput,
    ) {
  
      const result = await this.service.createQueue(input.name, input.fifoQueue);
      const QueueUrl = result.QueueUrl;
      return res.redirect(302, '/sqs');
    }
  
    @Get('delete-queue')
    async deleteQueue(
      @Res() response: Response,
      @Query('queue') queue: string
    ) {
      const result = await this.service.deleteQueue(queue);
      return response.redirect(302, '/sqs');
    }
  
    @Get('purge-queue')
    async purgeQueue(
      @Query('queue') queue: string,
      @Res() response: Response,
    ) {
  
      const globAll = /\*/ig;
      const isglobAll = globAll.test(queue);
      if (isglobAll) {
        /* find all queues and purge them */
        const { data, nextToken } = await this.service.listQueues(100);
        if (Array.isArray(data)) {
          for (const queue of data) {
            this.service.purgeQueue(queue.name);
          }
        }
      }
  
      if (!isglobAll) {
        const result = await this.service.purgeQueue(queue);
      }
  
      return response.redirect(302, '/sqs');
    }
  
    @Get('detail')
    async queueDetail(
      @Res() res: Response,
      @Query('name') name: string,
    ) {
      const { $metadata, ...attributes } = await this.service.getQueueAttributes(name);
      const result = await this.service.listMessages(name, 10);
      const isFifoQueue = name.endsWith('.fifo');

      const dlqRegex = /dlq/ig;
      const isDLQ = dlqRegex.test(name);
  
      return res.render('sqs-queue-detail', { name, attributes, messages: result.Messages, isFifoQueue, isDLQ });
    }
  
    @Get('send-message')
    async getSendMessage(
      @Query('queue') queue: string,
      @Res() res: Response
    ) {
      const isFifoQueue = queue?.endsWith('.fifo');
      return res.render('sqs-send-message', { queueName: queue, isFifoQueue });
    }
  
    @Post('send-message')
    async sendMessage(
      @Res() res: Response,
      @Body() input: SendMessageInput,
    ) {
      const isFifoQueue = input?.queueUrl?.endsWith('.fifo');
      const response = await this.service.sendMessage(input.queueUrl, input.body, input.groupId, input.duplicationId, input.messageAttributes);
      return res.redirect(302, `/sqs/send-message?queue=${input.queueUrl}`);
    }

    @Get('start-redrive')
    async startRedrive(
      @Query('queue') queue: string,
      @Res() res: Response,
    ) {
  
      const response = await this.service.startRedrive(queue);
      return res.redirect(302, '/sqs');
    }
  
    @Post('delete-message')
    async deleteSqsMessage(
      @Body() input: DeleteMessageInput,
      @Res() res: Response,
    ) {
      const response = await this.service.deleteSqsMessage(input.queueUrl, input.receiptHandle);
      return res.redirect(302, `/sqs/detail?name=${input.queueUrl}`);
  
    }

}
