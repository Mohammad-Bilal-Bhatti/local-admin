import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { SqsModule } from './sqs/sqs.module';
import { S3Module } from './s3/s3.module';
import { KmsModule } from './kms/kms.module';
import { SecretsManagerModule } from './secrets-manager/secrets-manager.module';
import { DynamoDbModule } from './dynamodb/dynamodb.module';
import { SnsModule } from './sns/sns.module';
import { SsmModule } from './ssm/ssm.module';
import { EventBridgeModule } from './event-bridge/event-bridge.module';
import { AllExceptionsFilter } from './shared/filters/all-execption.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { IamModule } from './iam/iam.module';
import { AcmModule } from './acm/acm.module';
import { LambdaModule } from './lambda/lambda.module';
import { Ec2Module } from './ec2/ec2.module';
import { GatewayModule } from './gateway/gateway.module';
import { CwModule } from './cw/cw.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AcmModule,
    CwModule,
    DynamoDbModule,
    Ec2Module,
    EventBridgeModule,
    GatewayModule,
    IamModule,
    KmsModule,
    LambdaModule,
    S3Module,
    SecretsManagerModule,
    SnsModule,
    SqsModule,
    SsmModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: []
})
export class AppModule { }
