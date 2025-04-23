import { ITelegramAuthDto } from '@/auth/dto/entry-dto';
import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService,
    // @Inject(forwardRef(() => TelegramService))
    // private readonly telegramService: TelegramService,
  ) { }


  async findUserById(userBaseId: string) {
    return await this.database.user.findUnique({
      where: { id: userBaseId },
    });
  }

  async findUserByTelegramId(telegramId: number) {
    return await this.database.user.findUnique({
      where: {
        telegramId: telegramId
      },
    })

  }

  async findOrCreateUser(createUserDto: ITelegramAuthDto) {
    const { id, last_name, first_name, username, photo_url } = createUserDto

    const existingUser = await this.database.user.findUnique({
      where: {
        telegramId: id,
      }
    })

    // console.log('existingUser',existingUser)

    if (existingUser) return existingUser


    return await this.database.user.create({
      data: {
        telegramId: id,
        firstName: first_name,
        lastName: last_name,
        username: username,
        photoUrl: photo_url,

      }
    })

  }






}






