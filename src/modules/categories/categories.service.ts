import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }],
    });
  }

  async findById(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async create(data: {
    title: string;
    image?: string | null;
    isVisible?: boolean;
  }) {
    const lastCategory = await this.prisma.category.findFirst({
      where: { deletedAt: null },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = (lastCategory?.order ?? 0) + 1;

    return this.prisma.category.create({
      data: {
        title: data.title,
        image: data.image ?? null,
        isVisible: data.isVisible ?? true,
        order: nextOrder,
      },
    });
  }

  async update(
    id: string,
    data: { title?: string; image?: string | null; isVisible?: boolean },
  ) {
    await this.findById(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        image: data.image,
        isVisible: data.isVisible,
      },
    });
  }

  async updateBatchOrder(items: { id: string; order: number }[]) {
    return this.prisma.$transaction(
      items.map((item) =>
        this.prisma.category.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }

  async delete(id: string) {
    const category = await this.findById(id);

    await this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    await this.prisma.category.updateMany({
      where: {
        deletedAt: null,
        order: {
          gt: category.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    return { id: category.id };
  }
}
