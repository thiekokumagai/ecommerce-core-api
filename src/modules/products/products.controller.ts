import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { ListProductsDto } from './dto/list-products.dto';
  import { ProductResponseDto } from './dto/product-response.dto';
  
  import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
  } from '@nestjs/swagger';
  
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @ApiTags('Products')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Controller('products')
  export class ProductsController {
    constructor(private service: ProductsService) {}
  
    // 📃 LISTAGEM (COM DTO)
    @Get()
    @ApiOperation({ summary: 'Listar produtos com filtros' })
    @ApiResponse({ status: 200, description: 'Lista de produtos', type: [ProductResponseDto] })
    findAll(@Query() query: ListProductsDto) {
      return this.service.findAll(query.page);
    }
  
    // 📦 CREATE
    @Post()
    @ApiOperation({ summary: 'Criar produto' })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso', type: ProductResponseDto })
    create(@Body() dto: CreateProductDto) {
      return this.service.create(dto);
    }
  }