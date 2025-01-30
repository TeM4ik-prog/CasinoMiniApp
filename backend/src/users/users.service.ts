import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { adminData } from './entities/admin.entities';
import { AdminDto } from './dto/create-admin-dto';
import { usersSearchDto } from './dto/usersSearch-dto';
import { DatabaseService } from '@/database/database.service';
import { RolesClass, UserId } from '@/types/types';
import { RegisterDto } from '@/auth/dto/register-dto';
import { IGoogleAuthDto, ITelegramAuthDto } from '@/auth/dto/entry-dto';

@Injectable()
export class UsersService {
  protected userBaseDb: DatabaseService['userBase'];
  protected emailUsersDb: DatabaseService['emailUser'];
  protected telegramUsersDb: DatabaseService['telegramUser'];
  protected googleUsersDb: DatabaseService['googleUser'];

  constructor(private dbService: DatabaseService) {
    this.userBaseDb = dbService.userBase;
    this.emailUsersDb = dbService.emailUser;
    this.telegramUsersDb = dbService.telegramUser;
    this.googleUsersDb = dbService.googleUser;
  }

  async findUserById(id: string) {
    const user = await this.userBaseDb.findUnique({
      where: { id },
      include: {
        EmailUser: true,
        TelegramUser: true,
        GoogleUser: true,
      },
    });

    return user;
  }

  async switchBanUser(userId: string) {}

  async findAll(query: usersSearchDto) {
    let { page = '1', limit = '15' } = query;

    if (parseInt(page) <= 0) page = '1';
    const take = parseInt(limit, 10) || 15;
    const skip = ((parseInt(page, 10) || 1) - 1) * take;

    const baseWhere: any = {
      role: {
        not: {
          in: [RolesClass.admin, RolesClass.superAdmin],
        },
      },
    };

    if (query.search) {
      const search = query.search;
      baseWhere.OR = [
        // { email: { contains: search } },
        // { name: { contains: search } },
        // { employeeID: { contains: search } }
      ];
    }

    if (query.filterParams) {
      const { isRecipient, isOrderUser, isController } = query.filterParams;
      if (isRecipient) baseWhere.recipient = true;
      if (isOrderUser) baseWhere.role = RolesClass.orderUser;
      if (isController) baseWhere.role = RolesClass.controller;
    }

    const totalCount = await this.userBaseDb.count({
      where: baseWhere,
    });

    let maxPage = Math.ceil(totalCount / take);
    if (maxPage <= 0) maxPage = 1;

    const users = await this.userBaseDb.findMany({
      where: baseWhere,
      take,
      skip,
      include: {
        EmailUser: true,
        TelegramUser: true,
        GoogleUser: true,
      },
    });

    return {
      users,
      pagination: {
        totalCount,
        maxPage,
        currentPage: parseInt(page, 10),
        limit: take,
      },
    };
  }

  // async generateUsers(count: number) {
  //   const users = [];
  //   for (let i = 0; i < count; i++) {
  //     const user = {
  //       employeeID: `emp${i + 1}`,
  //       phone: `+123456789${i}`,
  //       email: `user${i + 1}@example.com`,
  //       name: `User ${i + 1}`,
  //       password: await argon2.hash(`password${i + 1}`),
  //       organizationId: null,
  //     };

  //     users.push(user)
  //   }

  //   for (const user of users) {
  //     try {
  //       await this.createFakeUser(user);
  //     } catch (error) {
  //       console.error(`Error creating user`);
  //       console.log(error)
  //     }
  //   }
  // }

  // async createFakeUser(users: []) {
  //   await this.databaseService.user.createMany({
  //     data: users,
  //   })
  // }
}

@Injectable()
export class EmailUsersService extends UsersService {
  async findOrCreateAdmins(userCreateDto: AdminDto[]) {
    const existingUsers = await this.userBaseDb.findMany({
      where: {
        role: { in: [RolesClass.admin, RolesClass.superAdmin] },
        EmailUser: {
          email: { in: userCreateDto.map((u) => u.email) },
        },
      },
      include: {
        EmailUser: true,
      },
    });

    const existingEmails = existingUsers.flatMap((user) =>
      user.EmailUser ? [user.EmailUser.email] : [],
    );

    const usersToCreate = userCreateDto.filter(
      (user) => !existingEmails.includes(user.email),
    );
    console.log(usersToCreate);

    const createdUsers = await Promise.all(
      usersToCreate.map(async (user) => {
        const newUserBase = await this.userBaseDb.create({
          data: {
            role: user.role,
            EmailUser: {
              create: {
                email: user.email,
                password: await argon2.hash(user.password),
              },
            },
          },
        });
        return newUserBase;
      }),
    );

    await Promise.all(
      existingUsers.map(async (existingUser) => {
        const userDto = userCreateDto.find(
          (u) => u.email === existingUser.EmailUser?.email,
        );

        if (userDto && existingUser.EmailUser?.password) {
          const isPasswordUpdated = await argon2.verify(
            existingUser.EmailUser.password,
            userDto.password,
          );

          if (!isPasswordUpdated) {
            await this.emailUsersDb.update({
              where: { id: existingUser.EmailUser.id },
              data: {
                password: await argon2.hash(userDto.password),
              },
            });
          }
        }
      }),
    );

    return { existingEmails, usersToCreate, createdUsers };
  }

  async create(createUserDto: RegisterDto) {
    const existingUser = await this.findOne(createUserDto.email);
    console.log(existingUser);

    if (existingUser) throw new BadRequestException(`User already exists`);

    const createdUser = await this.userBaseDb.create({
      data: {
        EmailUser: {
          create: {
            email: createUserDto.email,
          },
        },
      },
      include: {
        EmailUser: true,
      },
    });

    return createdUser;
  }

  async changePassword(userId: string, password: string) {
    return await this.emailUsersDb.update({
      where: { id: userId },
      data: {
        password: await argon2.hash(password),
      },
    });
  }

  async findOne(email: string) {
    const user = await this.emailUsersDb.findUnique({
      where: { email },
      include: {
        userBase: true,
      },
    });
    return user;
  }

  async findOneById(id: string) {
    return this.emailUsersDb.findUnique({
      where: { id },
    });
  }

  async createAdminsOnInit() {
    return await this.findOrCreateAdmins(adminData);
  }
}

@Injectable()
export class TelegramUsersService extends UsersService {
  async findOrCreate(telegramData: ITelegramAuthDto) {
    console.log(telegramData);
    const existingUser = await this.findOneByTelegramId(telegramData.id);

    console.log(existingUser);
    if (existingUser) {
      return await this.findUserById(existingUser.userBaseId);
    }

    const createdUser = await this.userBaseDb.create({
      data: {
        TelegramUser: {
          create: {
            telegramId: telegramData.id.toString(),
            username: telegramData.username,
            firstName: telegramData.first_name,
            photoUrl: telegramData.photo_url,
            authDate: new Date(telegramData.auth_date * 1000),
          },
        },
      },
      include: {
        TelegramUser: true,
      },
    });

    return createdUser;
  }

  async findOneByTelegramId(telegramId: string | number) {
    return await this.telegramUsersDb.findUnique({
      where: { telegramId: telegramId.toString() },
    });
  }

  async findOneById(id: string) {
    return this.telegramUsersDb.findUnique({
      where: { id },
    });
  }
}

@Injectable()
export class GoogleUsersService extends UsersService {
  async findOrCreate(googleData: IGoogleAuthDto) {
    const existingUser = await this.findOneByEmail(googleData.email);

    console.log(existingUser);
    if (existingUser) {
      return await this.findUserById(existingUser.userBaseId);
    }

    const createdUser = await this.userBaseDb.create({
      data: {
        GoogleUser: {
          create: {
            email: googleData.email,
            name: googleData.name,
            photoUrl: googleData.picture,
            givenName: googleData.given_name,
          },
        },
      },
      include: {
        GoogleUser: true,
      },
    });

    return createdUser;
  }

  async findOneByEmail(email: string) {
    return await this.googleUsersDb.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string) {
    return this.googleUsersDb.findUnique({
      where: { id },
    });
  }
}

@Injectable()
export class UsersAdminService extends UsersService {
  async getAdmins() {
    return await this.userBaseDb.findMany({
      where: {
        role: RolesClass.admin,
      },
    });
  }

  async switchBanAdmins(adminId: string) {
    const admin = await this.userBaseDb.findUnique({
      where: { id: adminId },
      select: { banned: true },
    });

    if (!admin) throw new Error('Admin not found');

    const banned = !admin.banned;

    await this.userBaseDb.update({
      where: { id: adminId },
      data: {
        banned: banned,
      },
    });

    return { banned };
  }
}
