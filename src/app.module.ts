import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot(), HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
