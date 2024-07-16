import { Controller, Get } from '@nestjs/common';
import { PartyService } from './party.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('party')
@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Get('commitking')
  async getCommitKing() {
    return this.partyService.getCommitKingOfMonth();
  }

  @Get('communicationking')
  async getCommunicationKing() {
    return this.partyService.getCommunicationKingOfMonth();
  }

//   @Get('consistenttil')
//   async getConsistentTil() {
//     return this.partyService.getConsistentTilOfWeek();
//   }
}
