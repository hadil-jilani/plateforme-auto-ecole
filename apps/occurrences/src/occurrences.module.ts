import { Module } from '@nestjs/common';
import {  OccurrencesController } from './occurrences.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, occurrence, OccurrenceModel } from '@app/shared';
import { OccurrencesService } from './occurrences.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
      }),
      MongooseModule.forFeature([{name: OccurrenceModel.name, schema: occurrence}]),
      DatabaseModule
  ],
  controllers: [OccurrencesController],
  providers: [OccurrencesService],
})
export class OccurrencesModule {}
