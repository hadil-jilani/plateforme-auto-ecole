import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '@app/shared/database/db.module';
import { ecole, EcoleModel } from '@app/shared/Schemas/ecole.schema';
import { createRabbitMQClient } from '@app/shared/utils/rmq';
import { AuthGuard } from '@app/shared/Guards/auth.guard';

@Module({
  imports: [JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forFeature([{ name: EcoleModel.name, schema: ecole }]),
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    AuthGuard,
    ConfigService,
    {
      provide: 'auth',
      useFactory: (configService: ConfigService) => createRabbitMQClient('auth_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'demande',
      useFactory: (configService: ConfigService) => createRabbitMQClient('demande_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'formateur',
      useFactory: (configService: ConfigService) => createRabbitMQClient('formateur_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'profile',
      useFactory: (configService: ConfigService) => createRabbitMQClient('profile_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'apprenant',
      useFactory: (configService: ConfigService) => createRabbitMQClient('apprenant_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'occurrence',
      useFactory: (configService: ConfigService) => createRabbitMQClient('occurrence_queue', configService),
      inject: [ConfigService],
    },
    {
      provide: 'agenda',
      useFactory: (configService: ConfigService) => createRabbitMQClient('agenda_queue', configService),
      inject: [ConfigService],
    },
  ],
})
export class AppModule { }
