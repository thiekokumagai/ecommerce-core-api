import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VariationsService {
  constructor(private prisma: PrismaService) {}

  // 📦 CREATE
  async create(data: { title: string }) {
    return this.prisma.variation.create({
      data: {
        title: data.title,
      },
    });
  }

  // 📃 LISTAGEM (com paginação)
  async findAll(page = 1, limit = 10) {
    return this.prisma.variation.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        deletedAt: null,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  // 🔍 FIND ONE
  async findOne(id: string) {
    const variation = await this.prisma.variation.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!variation) {
      throw new NotFoundException('Variação não encontrada');
    }

    return variation;
  }

  // ✏️ UPDATE
  async update(id: string, data: { title?: string }) {
    await this.findOne(id);

    return this.prisma.variation.update({
      where: { id },
      data,
    });
  }

  // 🗑️ DELETE (soft delete)
  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.variation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
