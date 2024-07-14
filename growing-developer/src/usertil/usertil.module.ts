import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTilService } from './usertil.service';
import { UserTilController } from './usertil.controller';
import { UserTil, UserTilSchema } from './usertil.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserTil.name, schema: UserTilSchema }])],
  providers: [UserTilService],
  controllers: [UserTilController],
  exports: [UserTilService],
})
export class UserTilModule {}
