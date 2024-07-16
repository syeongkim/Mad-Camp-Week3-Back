import { Module } from '@nestjs/common';
import { PartyService } from './party.service';
import { PartyController } from './party.controller';
import { RecordModule } from '../record/record.module'; // RecordsService를 사용하는 경우 필요
import { PostModule } from '../post/post.module'; // PostsService를 사용하는 경우 필요
import { UserTilModule } from '../usertil/usertil.module'; // UserTilService를 사용하는 경우 필요

@Module({
  imports: [RecordModule, PostModule, UserTilModule ], // RecordsService를 사용하므로 RecordsModule을 임포트
  providers: [PartyService],
  controllers: [PartyController],
  exports: [PartyService],
})
export class PartyModule {}
