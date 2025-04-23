import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthTonnelData } from './dto/user-data-dto';
import { TelegramService } from '@/telegram/telegram.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    
  ) { }



}
