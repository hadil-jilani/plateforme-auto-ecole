import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, ecole, EcoleModel } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          secure: false,
          auth: {
            user: config.get('SMTP_MAIL'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        tls: {
          rejectUnauthorized: false,
        },
        defaults: {
          from: 'from@example.com',
        },  
      }),
      inject: [ConfigService],
    }),
      MongooseModule.forFeature([{name : EcoleModel.name ,schema : ecole }]),
      DatabaseModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
