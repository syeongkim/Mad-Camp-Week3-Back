import { Module, forwardRef  } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { RecordModule } from '../record/record.module';
import { UserItemModule } from 'src/useritem/useritem.module';
import { UserTilModule } from 'src/usertil/usertil.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, UserModule, forwardRef(() => RecordModule), UserItemModule, UserTilModule ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
