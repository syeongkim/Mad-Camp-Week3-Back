import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECERT');
    this.redirectUri = 'http://localhost:3000/auth/github/callback';
  }

  getClientId(): string {
    return this.clientId;
  }

  getRedirectUri(): string {
    return this.redirectUri;
  }

  async getGitHubAccessToken(code: string): Promise<string> {
    console.log('Client ID:', this.clientId);
    console.log('Client Secret:', this.clientSecret);
    console.log('Code:', code);

    const response: AxiosResponse = await lastValueFrom(
      this.httpService.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
          },
          headers: {
            accept: 'application/json',
          },
        },
      ),
    );

    console.log('Access Token Response:', response.data);

    return response.data.access_token;
  }

  async getGitHubUser(accessToken: string): Promise<any> {
    const response: AxiosResponse = await lastValueFrom(
      this.httpService.get(
        'https://api.github.com/user',
        {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        },
      ),
    );

    return response.data;
  }
}
