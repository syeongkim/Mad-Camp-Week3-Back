import { Injectable } from '@nestjs/common';
import { RecordService } from '../record/record.service';
import { PostService } from '../post/post.service';
import { UserTilService } from '../usertil/usertil.service';

@Injectable()
export class PartyService {
  constructor(
    private readonly recordsService: RecordService,
    private readonly postsService: PostService,
    private readonly usertilService: UserTilService,
  ) {}

  async getTopCommitterOfWeek() {
    return this.recordsService.getTopCommitterOfWeek();
  }

  async getCommunicationKingOfWeek(): Promise<{ username: string, count: number } | null> {
    return this.postsService.getTopSenderOfWeek();
  }
  

  async getConsistentTilOfDays(days: number): Promise<string[]> {
    return this.usertilService.getConsistentTilUsers(days);
  }
}
