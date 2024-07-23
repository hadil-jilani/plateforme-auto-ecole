import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "@app/shared/database/db.module";
import { createRabbitMQClient } from "@app/shared/utils/rmq";
import { ecole, EcoleModel } from "@app/shared";

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('ACCESS_TOKEN_EXPIRATION'),
        },
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([{name: EcoleModel.name, schema: ecole
    }])
    
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    ConfigService,
    {
      provide: 'Emails',
      useFactory: (configService: ConfigService) => createRabbitMQClient('email-queue', configService),
      inject: [ConfigService],
    }
  ],
})
export class AuthModule {}
