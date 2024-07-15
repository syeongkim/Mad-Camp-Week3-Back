import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RecordService } from '../record/record.service';
import { UserItemService } from '../useritem/useritem.service';
import { UserTilService } from '../usertil/usertil.service';
// import { UserPostService } from '..userpost/userpost.service';

import { access } from 'fs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly recordService: RecordService,
    private readonly useritemService: UserItemService,
    private readonly userTilService: UserTilService,
    private readonly configService: ConfigService,
    // private readonly userPostService: UserPostService,
  ) {

  }

  @Get('github')
  async githubAuth(@Res() res) {
    const url = `https://github.com/login/oauth/authorize?client_id=${this.authService.getClientId()}&redirect_uri=${this.authService.getRedirectUri()}&scope=read:user`;
    res.redirect(url);
  }

  @Get('github/callback')
  async githubAuthCallback(@Query('code') code: string, @Res() res) {
    try {
      const accessToken = await this.authService.getGitHubAccessToken(code);
      // const devaccesstoken = this.configService.get<string>('GITHUB_ACCESS_TOKEN');
      const githubUser = await this.authService.getGitHubUser(accessToken);
      console.log("***:", githubUser);
      const isExisting = await this.userService.findUserByUserName({ 
        username: githubUser['login'],
      });
      
      if (!isExisting) {
        const user = await this.userService.createUser({
          username: githubUser['login'],
          profile: githubUser['avatar_url'],
          access_token: accessToken,
        });
        const record = await this.recordService.createRecord({
          username: githubUser['login'],
        });
        const userItem = await this.useritemService.createUserItem({
          username: githubUser['login'],
        });
        const userTil = await this.userTilService.createUserTil(githubUser['login']);
      }

      try {
        await this.recordService.updateHasCommit(githubUser['login']);
      } catch (e) {
        console.error('Error updating hasCommit in controller:', e.message);
      }
      

      res.status(HttpStatus.OK).json({'username': githubUser['login'], 'loggedIn': true});
      //res.redirect(`http://localhost:3000/myroom/${githubUser['login']}`); 
    } catch (e) {
      console.error('Error fetching access token or user data in controller:', e.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Authentication failed');
    }
  }
}
