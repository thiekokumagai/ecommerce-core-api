import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';

@Injectable()
export class VariationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVariationDto) {
    const normalizedOptions = this.normalizeOptionValues(dto.options);

    return this.prisma.variation.create({
      data: {
        title: dto.title.trim(),
        options: {
          create: normalizedOptions.map((value, index) => ({
            value,
            order: index + 1,
          })),
        },
      },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  findAll() {
    return this.prisma.variation.findMany({
      where: { deletedAt: null },
      orderBy: { title: 'asc' },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: string) {
    const variation = await this.prisma.variation.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!variation) {
      throw new NotFoundException('Variação não encontrada');
    }

    return variation;
  }

  async update(id: string, dto: UpdateVariationDto) {
    await this.findOne(id);

    const normalizedOptions = dto.options
      ? this.normalizeOptionValues(dto.options)
      : null;

    return this.prisma.$transaction(async (tx) => {
      await tx.variation.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        },
      });

      if (normalizedOptions) {
        const existingOptions = await tx.variationOption.findMany({
          where: { variationId: id },
          select: { id: true, value: true },
        });

        const existingMap = new Map(
          existingOptions.map((option) => [option.value.toLowerCase(), option]),
        );

        const nextValueSet = new Set(
          normalizedOptions.map((value) => value.toLowerCase()),
        );

        const optionIdsToDelete = existingOptions
          .filter((option) => !nextValueSet.has(option.value.toLowerCase()))
          .map((option) => option.id);

        if (optionIdsToDelete.length > 0) {
          const usedOption = await tx.productItemOption.findFirst({
            where: {
              optionId: { in: optionIdsToDelete },
            },
            select: { id: true },
          });

          if (usedOption) {
            throw new ConflictException(
              'Não é possível remover opções já utilizadas em itens do produto',
            );
          }

          await tx.variationOption.deleteMany({
            where: { id: { in: optionIdsToDelete } },
          });
        }

        for (let i = 0; i < normalizedOptions.length; i++) {
          const value = normalizedOptions[i];
          const existing = existingMap.get(value.toLowerCase());

          if (existing) {
            await tx.variationOption.update({
              where: { id: existing.id },
              data: {
                value,
                order: i + 1,
              },
            });
            continue;
          }

          await tx.variationOption.create({
            data: {
              variationId: id,
              value,
              order: i + 1,
            },
          });
        }
      }

      return tx.variation.findUniqueOrThrow({
        where: { id },
        include: {
          options: {
            orderBy: { order: 'asc' },
          },
        },
      });
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.variation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private normalizeOptionValues(values: string[]) {
    const normalized = values
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const seen = new Set<string>();

    for (const value of normalized) {
      const key = value.toLowerCase();
      if (seen.has(key)) {
        throw new ConflictException(
          'Não pode existir duplicação de opção dentro da mesma variação',
        );
      }
      seen.add(key);
    }

    if (normalized.length === 0) {
      throw new BadRequestException('A variação deve ter ao menos uma opção');
    }

    return normalized;
  }
  async updateBatchOrder(items: { id: string; order: number }[]) {
    const options = await this.prisma.variationOption.findMany({
      where: {
        id: { in: items.map((i) => i.id) },
      },
      select: {
        id: true,
        variationId: true,
      },
    });

    const merged = items.map((item) => {
      const option = options.find((o) => o.id === item.id);

      if (!option) {
        throw new NotFoundException(`Item não encontrado: ${item.id}`);
      }

      return {
        ...item,
        variationId: option.variationId,
      };
    });

    const grouped = merged.reduce((acc, item) => {
        if (!acc[item.variationId]) {
          acc[item.variationId] = [];
        }
        acc[item.variationId].push(item);
        return acc;
      },
      {} as Record<string, typeof merged>,
    );

    return this.prisma.$transaction(async (tx) => {
      for (const variationId in grouped) {
        const group = grouped[variationId];

        for (const item of group) {
          await tx.variationOption.update({
            where: { id: item.id },
            data: { order: item.order + 1000 },
          });
        }
      }
      for (const variationId in grouped) {
        const group = grouped[variationId];

        group.sort((a, b) => a.order - b.order);

        for (let i = 0; i < group.length; i++) {
          await tx.variationOption.update({
            where: { id: group[i].id },
            data: { order: i + 1 },
          });
        }
      }

      return true;
    });
  }
}
