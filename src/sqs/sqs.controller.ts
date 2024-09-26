import { Body, Controller, Get, ParseIntPipe, Post, Query, Redirect, Render, Res } from "@nestjs/common";
import { Response } from 'express';
import { SqsService } from "./sqs.service";
import { CreateQueueInput, DeleteMessageInput, SendMessageInput } from "./sqs.input.dto";

@Controller('sqs')
export class SqsController {

    constructor(private readonly service: SqsService) {}

    @Get()
    @Render('sqs-list')
    async queues(
      @Query('limit', new ParseIntPipe({ optional: true })) limit = 100,
      @Query('search') search: string,
    ) {
      const { data, nextToken } = await this.service.listQueues(search, limit);
      data.map(queue => {
        const dlqRegex = /dlq/ig;
        queue['isDLQ'] = dlqRegex.test(queue.name);
      });
  
      return { queues: data, nextToken };
    }

    @Get('create')
    @Render('sqs-create-queue')
    async getCreateQueue() {
      return null;
    }
  
    @Post('create')
    @Redirect('/sqs', 302)
    async createQueue(
      @Body() input: CreateQueueInput,
    ) {
  
      const result = await this.service.createQueue(input.name, input.fifoQueue);
      const QueueUrl = result.QueueUrl;
      return null;
    }
  
    @Get('delete-queue')
    @Redirect('/sqs', 302)
    async deleteQueue(
      @Query('queue') queue: string
    ) {
      const result = await this.service.deleteQueue(queue);
      return null;
    }
  
    @Get('purge-queue')
    @Redirect('/sqs', 302)
    async purgeQueue(
      @Query('queue') queue: string,
    ) {
  
      const globAll = /\*/ig;
      const isglobAll = globAll.test(queue);
      if (isglobAll) {
        /* find all queues and purge them */
        const { data, nextToken } = await this.service.listQueues(null, 100);
        if (Array.isArray(data)) {
          for (const queue of data) {
            this.service.purgeQueue(queue.name);
          }
        }
      }
  
      if (!isglobAll) {
        const result = await this.service.purgeQueue(queue);
      }
  
      return null;
    }
  
    @Get('detail')
    @Render('sqs-queue-detail')
    async queueDetail(
      @Query('name') name: string,
    ) {
      const { $metadata, ...attributes } = await this.service.getQueueAttributes(name);
      const result = await this.service.listMessages(name, 10);
      const isFifoQueue = name.endsWith('.fifo');

      const dlqRegex = /dlq/ig;
      const isDLQ = dlqRegex.test(name);
  
      return { name, attributes, messages: result.Messages, isFifoQueue, isDLQ };
    }
  
    @Get('send-message')
    @Render('sqs-send-message')
    async getSendMessage(
      @Query('queue') queue: string,
    ) {
      const isFifoQueue = queue?.endsWith('.fifo');
      return { queueName: queue, isFifoQueue };
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
    @Redirect('/sqs', 302)
    async startRedrive(
      @Query('queue') queue: string,
    ) {
  
      const response = await this.service.startRedrive(queue);
      return null;
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
