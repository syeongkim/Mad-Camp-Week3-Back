import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RecordService } from '../record/record.service';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly recordService: RecordService,
  ) {}

  @Get('github')
  async githubAuth(@Res() res) {
    const url = `https://github.com/login/oauth/authorize?client_id=${this.authService.getClientId()}&redirect_uri=${this.authService.getRedirectUri()}&scope=read:user`;
    res.redirect(url);
  }

  @Get('github/callback')
  async githubAuthCallback(@Query('code') code: string, @Res() res) {
    try {
      const accessToken = await this.authService.getGitHubAccessToken(code);
      const githubUser = await this.authService.getGitHubUser(accessToken);
      const isExisting = await this.userService.findUserByUserName({ 
        username: githubUser.login,
      });
      
      if (!isExisting) {
        const user = await this.userService.createUser({
          username: githubUser.login,
          profile: githubUser.avatar_url,
        });
        const record = await this.recordService.createRecord({
          username: githubUser.login,
        });
      }

      const authOptions = {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      };
      await this.recordService.updateCommits(githubUser.login, authOptions);

      //res.status(HttpStatus.OK).json(user);
      res.redirect('http://localhost:3000/myroom'); 
    } catch (e) {
      console.error('Error fetching access token or user data:', e.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Authentication failed');
    }
  }
}
