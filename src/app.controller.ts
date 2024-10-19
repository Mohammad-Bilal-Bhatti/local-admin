import { Controller, Get, Res, Post, Body, Session } from '@nestjs/common';
import { Response } from 'express';
import { SqsService } from './sqs/sqs.service';
import { ConfigureInput } from './app.dto';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3/s3.service';
import { cards } from './shared/constants';
import { AcmService } from './acm/acm.service';
import { DynamoDbService } from './dynamodb/dynamodb.service';
import { Ec2Service } from './ec2/ec2.service';
import { EventBridgeService } from './event-bridge/event-bridge.service';
import { GatewayService } from './gateway/gateway.service';
import { IamService } from './iam/iam.service';
import { KmsService } from './kms/kms.service';
import { LambdaService } from './lambda/lambda.service';
import { SecretsManagerService } from './secrets-manager/secrets-manager.service';
import { SnsService } from './sns/sns.service';
import { SsmService } from './ssm/ssm.service';
import { CWService } from './cw/cw.service';
import { KinesisService } from './kinesis/kinesis.service';

@Controller()
export class AppController {

  constructor(
    private readonly config: ConfigService,
    private readonly acmService: AcmService,
    private readonly cwService: CWService,
    private readonly dynamoDbService: DynamoDbService,
    private readonly ec2Service: Ec2Service,
    private readonly eventBridgeService: EventBridgeService,
    private readonly gatewayService: GatewayService,
    private readonly iamService: IamService,
    private readonly kinesisService: KinesisService,
    private readonly kmsService: KmsService,
    private readonly lambdaService: LambdaService,
    private readonly s3Service: S3Service,
    private readonly secretManagerService: SecretsManagerService,
    private readonly snsService: SnsService,
    private readonly sqsService: SqsService,
    private readonly ssmService: SsmService,
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
    return res.render('root', { title: 'Home', message: 'Hello world!!', configuration, cards });
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
    this.acmService.configure(input);
    this.cwService.configure(input);
    this.dynamoDbService.configure(input);
    this.ec2Service.configure(input);
    this.eventBridgeService.configure(input);
    this.gatewayService.configure(input);
    this.iamService.configure(input);
    this.kmsService.configure(input);
    this.lambdaService.configure(input);
    this.s3Service.configure(input);
    this.secretManagerService.configure(input);
    this.snsService.configure(input);
    this.sqsService.configure(input);
    this.ssmService.configure(input);
    this.kinesisService.configure(input);

    return res.redirect(302, '/');
  }
}
