import { Controller, Get, Param } from '@nestjs/common';
import { PartyService } from './party.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('party')
@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Get('commitking')
  async getCommitKing() {
    return this.partyService.getTopCommitterOfWeek();
  }

  @Get('communicationking')
  async getCommunicationKing(): Promise<{ username: string, count: number } | null> {
    return this.partyService.getCommunicationKingOfWeek();
  }

  @Get('consistenttil/:days')
  async getConsistentTil(@Param('days') days: number): Promise<{ consistentUserList: string[] }> {
    return this.partyService.getConsistentTilOfDays(Number(days));
  }
}
