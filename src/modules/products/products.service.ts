import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(dto: any) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        categoryId: dto.categoryId,
        images: { create: dto.images.map(url => ({ url })) },
        variations: {
          create: dto.variationIds.map(id => ({ variationId: id })),
        },
      },
    });
  }

  findAll(page = 1) {
    return this.prisma.product.findMany({
      skip: (page - 1) * 10,
      take: 10,
      include: {
        category: true,
        images: true,
        variations: { include: { variation: true } },
      },
    });
  }
}