import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as helpers from './hbs/helpers';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  /* express monitor middleware */
  app.use(require('express-status-monitor')());

  app.use(
    session({
      secret: 'session-secret',
      resave: false,
      saveUninitialized: false,
    })
  ),

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir([
    join(__dirname, '..', 'views'),
    join(__dirname, '..', 'views', 's3'),
    join(__dirname, '..', 'views', 'sqs'),
    join(__dirname, '..', 'views', 'kms'),
    join(__dirname, '..', 'views', 'sns'),
    join(__dirname, '..', 'views', 'dynamodb'),
    join(__dirname, '..', 'views', 'secrets-manager'),
    join(__dirname, '..', 'views', 'ssm'),
    join(__dirname, '..', 'views', 'event-bridge'),
    join(__dirname, '..', 'views', 'iam'),
    join(__dirname, '..', 'views', 'acm'),
    join(__dirname, '..', 'views', 'lambda'),
    join(__dirname, '..', 'views', 'ec2'),
    join(__dirname, '..', 'views', 'gateway'),
    join(__dirname, '..', 'views', 'cw'),
    join(__dirname, '..', 'views', 'kinesis'),
    join(__dirname, '..', 'views', 'cf'),
    join(__dirname, '..', 'views', 'route53'),
    join(__dirname, '..', 'views', 'ses'),
    join(__dirname, '..', 'views', 'sfn'),
  ]);

  app.engine(
    'hbs',
    hbs({
      extname: 'hbs',
      defaultLayout: 'layout_main',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
      helpers: helpers,
    }),
  );

  app.setViewEngine('hbs');

  const port = config.get<number>('port');

  await app.listen(port, () => {
    logger.log(`Application started on port: ${port}`);
  });
}
bootstrap();
