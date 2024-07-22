import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ProfileModule } from './profile.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProfileModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'profile_queue'
      }
    }
  )

  app.useGlobalPipes(new ValidationPipe())
  app.listen();
 

  /* const app = await NestFactory.create(EmailModule);

  const configservice = app.get(ConfigService)

  const user = configservice.get('RABBITMQ_USER')
  const password = configservice.get('RABBITMQ_PASS')
  const host = configservice.get('RABBITMQ_HOST')
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: 'email-queue',
    },
  })
  app.enableCors();
  app.startAllMicroservices(); */

}
bootstrap();
