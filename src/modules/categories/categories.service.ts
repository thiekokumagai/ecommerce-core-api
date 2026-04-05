import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
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

  create(data: { title: string; image?: string | null; isVisible?: boolean }) {
    return this.prisma.category.create({
      data: {
        title: data.title,
        image: data.image,
        isVisible: data.isVisible,
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

  delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
