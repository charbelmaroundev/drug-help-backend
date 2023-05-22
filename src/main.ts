import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as morgan from 'morgan-body';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';

const port = process.env.SERVER_PORT;

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');

  // const logger = app.get(Logger);
  // (morgan as any)(app.getHttpAdapter().getInstance(), {
  //   stream: {
  //     write: (message: string) => {
  //       logger.log(message.replace('\n', ''));
  //       return true;
  //     },
  //   },
  // });

  app.use(bodyParser.json({ limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port);
  console.info(`SERVER IS RUNNING ON PORT: ${port}`);
})();
