import { Module } from '@nestjs/common';
import {  OccurrencesController } from './occurrences.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {  DatabaseModule, occurrence, OccurrenceModel } from '@app/shared';
import { createRabbitMQClient } from '@app/shared/utils/rmq';

import { OccurrencesService } from './occurrences.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
     /*  ClientsModule.register([
        {
          name: 'test',
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://user:password@localhost:5672'],
            queue: 'formateur_queue',
            queueOptions: {
              durable : true
            },
          },
        },
      ]), */
      MongooseModule.forFeature([{name: OccurrenceModel.name, schema: occurrence}]),
      DatabaseModule      
  ],
  controllers: [OccurrencesController],
  providers: [
    OccurrencesService,
    ConfigService,
    {
      provide: 'email',
      useFactory: (configService: ConfigService) => createRabbitMQClient('new-email', configService),
      inject: [ConfigService],
    },
    {
      provide: 'test',
      useFactory: (configService: ConfigService) => createRabbitMQClient( 'formateur_queue', configService),
      inject: [ConfigService],
    }
  ]
})
export class OccurrencesModule {}
