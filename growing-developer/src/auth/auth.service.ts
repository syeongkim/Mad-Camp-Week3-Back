import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly accesstoken: string;
  private readonly redirectUri: string;
  private readonly server: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECERT');
    this.accesstoken = this.configService.get<string>('GITHUB_ACCESS_TOKEN');
    this.server = this.configService.get<string>('SERVER');
    this.redirectUri = `http://${this.server}:3001/auth/github/callback`;
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

  async getGitHubUser(accessToken: string): Promise<AxiosResponse> {
    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error(`Error from GitHub: ${error.response.data.message}`);
        throw new HttpException(`Error from GitHub: ${error.response.data.message}`, error.response.status);
      } else {
        console.error('Error fetching access token or user data in service:', error);
        throw new HttpException('Error fetching access token or user data', 500);
      }
    }
  }
}
