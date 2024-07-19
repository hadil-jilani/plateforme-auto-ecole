import { NestFactory } from '@nestjs/core';
import { DemandesModule } from './demandes.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(DemandesModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'demande_queue'
      }
    }
  )

  app.useGlobalPipes(new ValidationPipe())
  app.listen();

  
  /* const app = await NestFactory.create(DemandesModule)
  const configservice = app.get(ConfigService)

  const user = configservice.get('RABBITMQ_USER')
  const password = configservice.get('RABBITMQ_PASS')
  const host = configservice.get('RABBITMQ_HOST')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: 'demande_queue',
    },
  })

  app.useGlobalPipes(new ValidationPipe());
  app.startAllMicroservices(); */
}
bootstrap();
