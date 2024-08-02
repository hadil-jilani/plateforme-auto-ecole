import { NestFactory } from '@nestjs/core';
import { TrainersModule } from './trainers.module';
import { Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(TrainersModule)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'trainer_queue',
      queueOptions: {
        durable: true
        }
    }
  }
)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'test',
      queueOptions: {
        durable: true
        }
    }
  }
);
await app.startAllMicroservices();
}
bootstrap();
