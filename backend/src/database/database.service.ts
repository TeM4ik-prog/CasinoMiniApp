import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // datasources: {
      //   db: {
      //     url: `file:${join(__dirname, '../../../../keystone/keystone.db')}`,
      //   },
      // },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Database service connected to Keystone DB');
  }

}
