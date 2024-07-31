import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createRabbitMQClient, DatabaseModule, trainer, TrainerModel, profile, AgendaModel } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forFeature([{name : TrainerModel.name ,schema : trainer }]),
    MongooseModule.forFeature([{name : AgendaModel.name ,schema : profile }]),
      DatabaseModule,
  ],
  controllers: [TrainersController],
  providers: [TrainersService,
    ConfigService,
    {provide: 'test2',
      useFactory: (configService: ConfigService) => createRabbitMQClient('test-form',configService),
      inject: [ConfigService]
    }
  ],
})
export class TrainersModule {}
