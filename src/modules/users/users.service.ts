import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const hash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
