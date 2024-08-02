import { NestFactory } from '@nestjs/core';
import { AgendaModule } from './agenda.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from '@app/shared';
import { AllExceptionsFilter } from '@app/shared/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AgendaModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'agenda_queue'
      }
    }
  )
  app.useGlobalPipes(new ValidationPipe())
  // app.useGlobalFilters(new RpcExceptionFilter());
  app.listen();
}
bootstrap();
