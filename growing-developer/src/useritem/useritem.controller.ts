import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UserItemService } from './useritem.service';
import { UserItem } from './useritem.schema';

@Controller('useritems')
export class UserItemController {
  constructor(private readonly userItemService: UserItemService) {}

  @Post()
  async createUserItem(@Body() userItemData: Partial<UserItem>): Promise<UserItem> {
    return this.userItemService.createUserItem(userItemData);
  }

  @Get(':username')
  async findUserItemByUsername(@Param('username') username: string): Promise<UserItem> {
    return this.userItemService.findUserItemByUsername(username);
  }

  @Put(':username/items')
  async updateUserItems(@Param('username') username: string, @Body() items: Partial<UserItem['items']>): Promise<UserItem> {
    return this.userItemService.updateUserItems(username, items);
  }

  @Get()
  async getAllUserItems(): Promise<UserItem[]> {
    return this.userItemService.getAllUserItems();
  }
}
