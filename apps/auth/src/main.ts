import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AuthModule)
  const configservice = app.get(ConfigService)

  const user = configservice.get('RABBITMQ_USER')
  const password = configservice.get('RABBITMQ_PASS')
  const host = configservice.get('RABBITMQ_HOST')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: 'auth_queue',
    },
  })

  app.useGlobalPipes(new ValidationPipe());
  app.startAllMicroservices();
}
bootstrap();

