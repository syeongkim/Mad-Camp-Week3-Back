import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserTilService } from './usertil.service';
import { UserTil } from './usertil.schema';
import { Til } from './til.schema';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('usertils')
@Controller('usertils')
export class UserTilController {
  constructor(private readonly userTilService: UserTilService) {}

  @Post(':username')
  @ApiParam({ name: 'username', required: true })
  async createUserTil(@Param('username') username: string): Promise<UserTil> {
    return this.userTilService.createUserTil(username);
  }

  @Get(':username')
  @ApiParam({ name: 'username', required: true })
  async findUserTilByUsername(@Param('username') username: string): Promise<UserTil> {
    return this.userTilService.findUserTilByUsername(username);
  }

  @Post(':username/til')
  @ApiParam({ name: 'username', required: true })
  @ApiBody({ type: Til })
  async addTil(@Param('username') username: string, @Body() tilData: Til): Promise<UserTil> {
    return this.userTilService.addTil(username, tilData);
  }

  @Put(':username/til/:id')
  @ApiParam({ name: 'username', required: true })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: Til })
  async updateTil(
    @Param('username') username: string,
    @Param('id') id: number,
    @Body() tilData: Partial<Til>,
  ): Promise<UserTil> {
    return this.userTilService.updateTil(username, id, tilData);
  }
  
  @Delete(':username/til/:id')
  @ApiParam({ name: 'username', required: true })
  @ApiParam({ name: 'id', required: true })
  async deleteTil(@Param('username') username: string, @Param('id') id: number): Promise<UserTil> {
    return this.userTilService.deleteTil(username, id);
  }
}
