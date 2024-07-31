import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, ecole, EcoleModel } from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@app/shared/Guards/roles.guard';
import { AuthGuard } from '@app/shared/Guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    ClientsModule.register([
      {
        name: 'Request',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'request-email-queue',
          queueOptions: {
            durable : true
          },
        },
      },
    ]),
    DatabaseModule,
    MongooseModule.forFeature([{name:EcoleModel.name, schema: ecole}])
  ],
  controllers: [RequestsController],
  providers: [RequestsService, AuthGuard, RolesGuard, JwtService],
})
export class RequestsModule {}
