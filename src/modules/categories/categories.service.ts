import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: [{ order: 'asc' }],
    });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: {
    title: string;
    image?: string | null;
    isVisible?: boolean;
  }) {
    const lastCategory = (await this.prisma.category.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    })) as { order: number } | null;

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

  update(
    id: string,
    data: { title?: string; image?: string | null; isVisible?: boolean },
  ) {
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
    const category: { id: string; order: number } | null =
      await this.prisma.category.findUnique({
        where: { id },
        select: {
          id: true,
          order: true,
        },
      });

    if (!category) return null;

    await this.prisma.category.delete({
      where: { id },
    });

    await this.prisma.category.updateMany({
      where: {
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
