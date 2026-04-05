import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { MinioService } from '../../minio/minio.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateOrderDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UploadedFile as UploadedFileType } from '../../common/types/uploaded-file.type';

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private service: CategoriesService,
    private minioService: MinioService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  @ApiResponse({
    status: 200,
    type: [CategoryResponseDto],
  })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Criar categoria com imagem' })
  @ApiResponse({
    status: 201,
    type: CategoryResponseDto,
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateCategoryDto,
  ) {
    let image: string | null = null;

    if (file) {
      const croppedBuffer = await sharp(file.buffer)
        .resize(92, 92, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 90 })
        .toBuffer();
      const upload = await this.minioService.uploadFile(
        {
          ...file,
          originalname: 'file.webp',
          buffer: croppedBuffer,
          mimetype: 'image/webp',
        } as UploadedFileType,
        'categories',
      );
      image = upload.fileName;
    }
    return this.service.create({
      title: body.title,
      image,
      isVisible: body.isVisible,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Atualizar categoria' })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateCategoryDto,
  ) {
    let image: string | null | undefined;
    const current = await this.service.findById(id);
    if (body.removeImage) {
      if (current?.image) {
        await this.minioService.deleteFile(current.image);
      }
      image = null;
    }

    if (file) {
      if (current?.image) {
        await this.minioService.deleteFile(current.image);
      }

      const croppedBuffer = await sharp(file.buffer)
        .resize(92, 92, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 90 })
        .toBuffer();

      const upload = await this.minioService.uploadFile(
        {
          ...file,
          originalname: 'file.webp',
          buffer: croppedBuffer,
          mimetype: 'image/webp',
        } as UploadedFileType,
        'categories',
      );

      image = upload.fileName;
    }

    return this.service.update(id, {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.isVisible !== undefined && { isVisible: body.isVisible }),
      ...(image !== undefined && { image }),
    });
  }

  @Patch('batch/order')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reordenar categorias' })
  async updateBatchOrder(@Body() body: UpdateOrderDto) {
    return this.service.updateBatchOrder(body.items);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar categoria' })
  async delete(@Param('id') id: string) {
    const category = await this.service.findById(id);
    if (category?.image) {
      await this.minioService.deleteFile(category.image);
    }

    return this.service.delete(id);
  }
}
