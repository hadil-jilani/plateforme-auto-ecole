import { Module } from '@nestjs/common';
import { LearnersController } from './learners.controller';
import { LearnersService } from './learners.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { learner, LearnerModel, DatabaseModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './.env',
  }),
  MongooseModule.forFeature([{name: LearnerModel.name, schema: learner}]),
  DatabaseModule
],
  controllers: [LearnersController],
  providers: [LearnersService],
})
export class LearnersModule {}
