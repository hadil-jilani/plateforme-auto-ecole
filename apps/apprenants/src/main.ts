import { NestFactory } from '@nestjs/core';
import { ApprenantsModule } from './apprenants.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ApprenantsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'apprenant_queue',
        queueOptions: {
          durable: true
        }
      }
    }
  );

  await app.listen();
}
bootstrap();
