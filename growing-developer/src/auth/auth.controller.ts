import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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

      const username = githubUser.login;
      const githubUrl = githubUser.html_url;

      res.status(HttpStatus.OK).json({ username: username, githubUrl: githubUrl });
    } catch (e) {
      console.error('Error fetching access token or user data:', e.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Authentication failed');
    }
  }
}
