import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany();
  }

  findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  create(data: { title: string; image?: string | null }) {
    return this.prisma.category.create({
      data,
    });
  }

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
