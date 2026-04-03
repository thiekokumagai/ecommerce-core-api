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
import { UpdateCategoryDto } from './dto/update-category.dto';
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

  // 📌 LISTAR
  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  @ApiResponse({
    status: 200,
    type: [CategoryResponseDto],
  })
  findAll() {
    return this.service.findAll();
  }

  // 📌 CREATE
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
      const upload = await this.minioService.uploadFile(
        file as UploadedFileType,
        'categories',
      );
      image = upload.fileName;
    }

    return this.service.create({
      title: body.title,
      image,
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
    let image: string | undefined;

    if (file) {
      const current = await this.service.findById(id);
      if (current?.image) {
        await this.minioService.deleteFile(current.image);
      }
      const upload = await this.minioService.uploadFile(
        file as UploadedFileType,
        'categories',
      );

      image = upload.fileName;
    }

    return this.service.update(id, {
      ...body,
      ...(image && { image }),
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar categoria' })
  async delete(@Param('id') id: string) {
    const category = await this.service.findById(id);

    if (category?.image) {
      const fileName = category.image.split('/').pop();
      if (fileName) {
        await this.minioService.deleteFile(fileName);
      }
    }

    return this.service.delete(id);
  }
}
