import { NestFactory } from '@nestjs/core';
import { LearnersModule } from './learners.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(LearnersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'learner_queue',
        queueOptions: {
          durable: true
        }
      }
    }
  );

  await app.listen();
}
bootstrap();
