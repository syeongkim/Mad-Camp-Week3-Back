import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RecordModule } from './record/record.module';
import { UserItemModule } from './useritem/useritem.module';
import { UserTilModule } from './usertil/usertil.module';
import { PostModule } from './post/post.module';
import { PartyModule } from './party/party.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정하여 모든 모듈에서 사용할 수 있게 합니다.
    }),
    MongooseModule.forRoot("mongodb://localhost:27017/growingDeveloper"),
    AuthModule,
    UserModule,
    RecordModule,
    UserItemModule,
    UserTilModule,
    HttpModule,
    PostModule,
    PartyModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
