import { Module } from '@nestjs/common';
import {  OccurrencesController } from './occurrences.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { createRabbitMQClient, DatabaseModule, occurrence, OccurrenceModel } from '@app/shared';
import { OccurrencesService } from './occurrences.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
      }),
      MongooseModule.forFeature([{name: OccurrenceModel.name, schema: occurrence}]),
      DatabaseModule,
      ClientsModule.register([
        {
          name: 'occ-email',
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://user:password@localhost:5672'],
            queue: 'occurrence-email',
            queueOptions: {
              durable : true
            },
          },
        },
      ]),
  ],
  controllers: [OccurrencesController],
  providers: [OccurrencesService
    ,{
    provide: 'occ-email',
    useFactory: (configService: ConfigService) => createRabbitMQClient('occurrence-email', configService),
    inject: [ConfigService],
  }
],
})
export class OccurrencesModule {}
