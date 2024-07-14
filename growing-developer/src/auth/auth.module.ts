import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { RecordModule } from '../record/record.module';
import { UserItemModule } from 'src/useritem/useritem.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, UserModule, RecordModule, UserItemModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
