import { Module } from '@nestjs/common';
import { FormateursController } from './formateurs.controller';
import { FormateursService } from './formateurs.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, formateur, FormateurModel } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forFeature([{name : FormateurModel.name ,schema : formateur }]),
      DatabaseModule,
  ],
  controllers: [FormateursController],
  providers: [FormateursService],
})
export class FormateursModule {}
