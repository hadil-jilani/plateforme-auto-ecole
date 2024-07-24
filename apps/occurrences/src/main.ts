import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { OccurrencesModule } from './occurrences.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OccurrencesModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'occurrence_queue',
        }
    }
  );
  app.useGlobalPipes(new ValidationPipe())
  await app.listen();
}
bootstrap();
