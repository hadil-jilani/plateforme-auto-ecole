import { Module } from '@nestjs/common';
import { ApprenantsController } from './apprenants.controller';
import { ApprenantsService } from './apprenants.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { apprenant, ApprenantModel, DatabaseModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './.env',
  }),
  MongooseModule.forFeature([{name: ApprenantModel.name, schema: apprenant}]),
  DatabaseModule
],
  controllers: [ApprenantsController],
  providers: [ApprenantsService],
})
export class ApprenantsModule {}
