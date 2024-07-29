import { Module } from '@nestjs/common';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, profile, AgendaModel } from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MongooseModule.forFeature([{ name: AgendaModel.name, schema: profile }]),
    DatabaseModule
  ],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}
