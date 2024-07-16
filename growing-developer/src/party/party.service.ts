import { Injectable } from '@nestjs/common';
import { RecordService } from '../record/record.service';
import { PostService } from '../post/post.service';
import { UserTilService } from '../usertil/usertil.service';

@Injectable()
export class PartyService {
  constructor(
    private readonly recordsService: RecordService,
    private readonly postsService: PostService,
    private readonly usertilsService: UserTilService,
  ) {}

  async getCommitKingOfMonth() {
    return this.recordsService.getTopCommitterOfMonth();
  }

  async getCommunicationKingOfMonth() {
    return this.postsService.getTopSenderOfMonth();
  }

//   async getConsistentTilOfWeek() {
//     // 로직 구현
//     return this.usertilsService.getConsistentTilUsers();
//   }
}
