import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(EmailModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setViewEngine('ejs');    
  const configservice = app.get(ConfigService)

  const user = configservice.get('RABBITMQ_USER')
  const password = configservice.get('RABBITMQ_PASS')
  const host = configservice.get('RABBITMQ_HOST')
  
  app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'email-queue'
      }
    }
  );
  app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue:'test-form'
      }
    }
  );
  app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'new-email'
      }
    }
  );
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'request-email-queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'occ-email',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices()

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
