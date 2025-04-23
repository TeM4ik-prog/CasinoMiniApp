import { BotScenes } from '@/types/types';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { Scene, SceneEnter, SceneLeave, On, Ctx } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

@Injectable()
@Scene(BotScenes.MIN_PROFIT)
export class MinProfitScene {
    constructor(private readonly userService: UsersService) { }

    @SceneEnter()
    async onEnter(@Ctx() ctx: Scenes.SceneContext) {
        await ctx.reply('Пожалуйста, отправь минимальный профит (в TON):');
    }

    @On('text')
    async onText(@Ctx() ctx: Scenes.SceneContext) {
        const text = ctx.message['text'];

        if (!ctx.scene.session['minProfitValue']) {
            const num = parseFloat(text);

            if (isNaN(num)) return ctx.reply('Это не число. Попробуй снова:')

            ctx.scene.session['minProfitValue'] = num;
            await ctx.reply(`Ты ввёл минимальный профит: ${num}\nНапиши "подтвердить" для сохранения или "отмена" для выхода.`);
            return;
        }

        if (text.toLowerCase() === 'подтвердить') {
            const value = ctx.scene.session['minProfitValue'];


            await ctx.reply(`Минимальный профит ${value} сохранён.`);
            return ctx.scene.leave();
        }

        if (text.toLowerCase() === 'отмена') {
            await ctx.reply('Операция отменена.');
            return ctx.scene.leave();
        }

        await ctx.reply('Напиши "подтвердить" или "отмена".');
    }

    @SceneLeave()
    async onLeave(@Ctx() ctx: Scenes.SceneContext) {
        delete ctx.scene.session['minProfitValue'];
    }
}
