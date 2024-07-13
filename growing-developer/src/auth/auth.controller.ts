import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
      console.log('GitHub User:', githubUser);

      const user = await this.userService.createOrUpdateUser({
        username: githubUser.login,
        profile: githubUser.avatar_url,
      });

      //res.status(HttpStatus.OK).json(user);
      res.redirect('http://localhost:3000/myroom'); 
    } catch (e) {
      console.error('Error fetching access token or user data:', e.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Authentication failed');
    }
  }
}
