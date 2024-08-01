import { Module } from '@nestjs/common';
import {  OccurrencesController } from './occurrences.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {  DatabaseModule, occurrence, OccurrenceModel, prestation, PrestationModel } from '@app/shared';
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
            queue: 'trainer_queue',
            queueOptions: {
              durable : true
            },
          },
        },
      ]), */
      MongooseModule.forFeature([{name: OccurrenceModel.name, schema: occurrence}]),
      MongooseModule.forFeature([{name: PrestationModel.name, schema: prestation}]),
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
      useFactory: (configService: ConfigService) => createRabbitMQClient( 'trainer_queue', configService),
      inject: [ConfigService],
    }
  ]
})
export class OccurrencesModule {}
