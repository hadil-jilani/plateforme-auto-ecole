import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard, DatabaseModule, ecole, EcoleModel, trainer, TrainerModel } from '@app/shared';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forFeature([{name : EcoleModel.name ,schema : ecole }]),
      DatabaseModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, JwtService,AuthGuard],
})
export class ProfileModule {}
