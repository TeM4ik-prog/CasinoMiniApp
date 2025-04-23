import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';



@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    private configService: ConfigService,
    private readonly userService: UsersService
  ) { }

  private tempStorage = new Map<number, number[]>();



  @Start()
  async onStart(@Ctx() ctx: Context) {
    // await this.userService.findOrCreateUser(ctx.from)

    await ctx.telegram.sendMessage(
      ctx.chat.id,
      'Добро пожаловать!',
      {
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Запустить приложение',
              web_app: { url: this.configService.get('APP_URL') },
            }],
          ],
        },
      }
    );
  }

}
