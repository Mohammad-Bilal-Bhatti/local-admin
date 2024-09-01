import { Controller, Get, Res, Post, Body, Session } from '@nestjs/common';
import { Response } from 'express';
import { SqsService } from './sqs/sqs.service';
import { ConfigureInput } from './app.dto';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3/s3.service';
import { cards } from './shared/constants';

@Controller()
export class AppController {

  constructor(
    private readonly config: ConfigService,
    private readonly sqsService: SqsService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  root(
    @Session() session: Record<string, any>,
    @Res() res: Response
  ) {
    
    /* get the default configuration from environment */
    const defaltConfiguration: ConfigureInput = { 
      endpoint: this.config.get<string>('localstack.endpoint'), 
      region: this.config.get<string>('localstack.region'),
    };
    const configuration = session['configuration'] ?? defaltConfiguration;
    return res.render('root', { title: 'Dashboard', message: 'Hello world!!', configuration, cards });
  }

  @Post('configure')
  async configure(
    @Session() session: Record<string, any>,
    @Body() input: ConfigureInput,
    @Res() res: Response,
  ) {

    /* update the session information. */
    session['configuration'] = input;

    /* save the configuration with in the service file */
    this.sqsService.configure(input);
    this.s3Service.configure(input);

    return res.redirect(302, '/');
  }
}
