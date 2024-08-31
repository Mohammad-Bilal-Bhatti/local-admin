import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as helpers from './hbs/helpers';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  const port = 8443;
  await app.listen(port);
}
bootstrap();
