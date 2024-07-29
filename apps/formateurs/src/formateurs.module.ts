import { Module } from '@nestjs/common';
import { FormateursController } from './formateurs.controller';
import { FormateursService } from './formateurs.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createRabbitMQClient, DatabaseModule, formateur, FormateurModel, profile, AgendaModel } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forFeature([{name : FormateurModel.name ,schema : formateur }]),
    MongooseModule.forFeature([{name : AgendaModel.name ,schema : profile }]),
      DatabaseModule,
  ],
  controllers: [FormateursController],
  providers: [FormateursService,
    ConfigService,
    {provide: 'test2',
      useFactory: (configService: ConfigService) => createRabbitMQClient('test-form',configService),
      inject: [ConfigService]
    }
  ],
})
export class FormateursModule {}
