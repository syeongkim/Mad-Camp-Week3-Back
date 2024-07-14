import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags, ApiResponse } from '@nestjs/swagger';

import { UserItemService } from './useritem.service';
import { UserItem } from './useritem.schema';
import { Item } from './item.schema';

@ApiTags('useritems')
@Controller('useritems')
export class UserItemController {
  constructor(private readonly userItemService: UserItemService) {}

  @Post()
  async createUserItem(@Body() userItemData: Partial<UserItem>): Promise<UserItem> {
    return this.userItemService.createUserItem(userItemData);
  }

  @Get(':username')
  @ApiResponse({ status: 200, description: 'The user data', type: UserItem })
  async findUserItemByUsername(@Param('username') username: string): Promise<UserItem> {
    return this.userItemService.findUserItemByUsername(username);
  }

  @Put(':username/items')
  @ApiBody({ type: [Item] })
  async updateUserItems(@Param('username') username: string, @Body() items: Partial<UserItem['items']>): Promise<UserItem> {
    return this.userItemService.updateUserItems(username, items);
  }

  @Put(':username/items/:itemName')
  @ApiParam({ name: 'username', required: true })
  @ApiParam({ name: 'itemName', required: true })
  @ApiBody({ type: Item })
  async updateUserItem(
    @Param('username') username: string,
    @Param('itemName') itemName: string,
    @Body() itemData: Item,
  ): Promise<UserItem> {
    itemData.name = itemName;
    return this.userItemService.updateUserItem(username, itemData);
  }
  // @Get()
  // async getAllUserItems(): Promise<UserItem[]> {
  //   return this.userItemService.getAllUserItems();
  // }
}
