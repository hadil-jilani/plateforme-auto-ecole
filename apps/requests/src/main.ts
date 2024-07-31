import { NestFactory } from '@nestjs/core';
import { RequestsModule } from './requests.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RequestsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'request_queue'
      }
    }
  )

  app.useGlobalPipes(new ValidationPipe())
  app.listen();

  
  /* const app = await NestFactory.create(RequestsModule)
  const configservice = app.get(ConfigService)

  const user = configservice.get('RABBITMQ_USER')
  const password = configservice.get('RABBITMQ_PASS')
  const host = configservice.get('RABBITMQ_HOST')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: 'request_queue',
    },
  })

  app.useGlobalPipes(new ValidationPipe());
  app.startAllMicroservices(); */
}
bootstrap();
