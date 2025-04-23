import { DatabaseService } from '@/database/database.service';
import { UsersService } from '@/users/users.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Input, Telegraf } from 'telegraf';
import { InputFile, Message } from 'telegraf/typings/core/types/typegram';


@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    @Inject('DEFAULT_BOT_NAME') private readonly botName: string,
    private readonly usersService: UsersService,
    private readonly database: DatabaseService
  ) { }

  getInfo(userId: number | undefined): string {
    return `ID пользователя: ${userId}`;
  }

  getPhotoStream(filePath: string): InputFile {
    return Input.fromLocalFile(filePath)
  }

 
 

}