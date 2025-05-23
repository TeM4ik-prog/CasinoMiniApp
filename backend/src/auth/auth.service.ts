import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { DatabaseService } from '@/database/database.service';
import { IBasicUser, validTelegramIds } from '@/types/types';
import { User } from 'telegraf/typings/core/types/typegram';
import { Prisma } from '@prisma/client';


@Injectable()
export class AuthService {
  private readonly encryptionKey: Buffer;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    this.encryptionKey = Buffer.from(
      this.configService.get<string>('ENCRYPTION_KEY'),
      'base64',
    );
  }


  async login(user: Prisma.UserCreateInput) {
    const { id, telegramId, firstName, username } = user;

    return {
      user: {
        ...user,
        hasRights: this.hasUserRight(user.telegramId)

      },
      token: this.jwtService.sign({ id, telegramId, firstName, username }),
    };
  }


  hasUserRight(telegramId: number): boolean {

    return validTelegramIds.includes(telegramId)

  }

  async handleExistingUser(user, organization) {
    if (user.banned) throw new UnauthorizedException('You are banned')
    return { verified: true };
  }
}
