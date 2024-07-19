import { NestFactory } from '@nestjs/core';
import { FormateursModule } from './formateurs.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(FormateursModule)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'formateur_queue',
      queueOptions: {
        durable: true
        }
    }
  }
);
await app.startAllMicroservices();
}
bootstrap();
