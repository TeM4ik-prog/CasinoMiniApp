import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	Request,
	BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
	UsersService,
} from 'src/users/users.service';
import { ITelegramAuthDto } from './dto/entry-dto';
import { User } from 'telegraf/typings/core/types/typegram';



@Controller('auth')
export class AuthController {
	constructor(
		protected readonly authService: AuthService,
		protected readonly usersService: UsersService,
		protected readonly jwtService: JwtService,
	) { }

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async getProfile(@Request() req) {
		return req.user;
	}

	@Post('/login')
	async login(
		@Body() telegramData: ITelegramAuthDto,
	) {
		console.log(telegramData);
		const user = await this.usersService.findOrCreateUser(telegramData);

		return await this.authService.login(user);
	}
}




