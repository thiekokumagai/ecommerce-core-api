import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { CategoriesService } from './categories.service';
  import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
  } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { CategoryResponseDto } from './dto/category-response.dto';
  
  @ApiTags('Categories')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard) 
  @Controller('categories')
  export class CategoriesController {
    constructor(private service: CategoriesService) {}
  
    @Get()
    @ApiOperation({ summary: 'Listar categorias' })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista retornada com sucesso', 
        type: [CategoryResponseDto] 
    })
    findAll() {
      return this.service.findAll();
    }
  
    @Post()
    @ApiOperation({ summary: 'Criar categoria' })
    @ApiResponse({ 
        status: 201, 
        description: 'Categoria criada', 
        type: CategoryResponseDto 
    })
    create(@Body() body: CreateCategoryDto ) {
      return this.service.create(body);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar categoria' })
    @ApiResponse({ 
        status: 200, 
        description: 'Categoria removida' 
    })
    delete(@Param('id') id: string) {
      return this.service.delete(id);
    }
  }