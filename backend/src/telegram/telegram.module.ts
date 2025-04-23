import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { UsersModule } from '@/users/users.module';
import { session } from 'telegraf';
import { MinProfitScene } from './scenes/minProfit.scene';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => DatabaseModule),

    forwardRef(() => UsersModule),


    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
        webhook: configService.get<string>('APP_URL'),

        middlewares: [
          session(),
        ],
      }),
      inject: [ConfigService],
    }),

  ],
  providers: [
    TelegramUpdate,
    TelegramService,

    MinProfitScene,
  ],
  exports: [TelegramService]
})
export class TelegramModule { }
