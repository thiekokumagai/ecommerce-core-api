import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { AttachProductVariationsDto } from './dto/attach-product-variations.dto';
import { CreateProductItemsDto } from './dto/create-product-items.dto';
import { UpdateProductItemStockDto } from './dto/update-product-item-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    type: [ProductResponseDto],
  })
  findAll(@Query() query: ListProductsDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto completo' })
  @ApiResponse({
    status: 200,
    description: 'Produto com categoria, imagens, variações e itens',
    type: ProductResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProductResponseDto,
  })
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Post(':id/variations')
  @ApiOperation({ summary: 'Vincular variações ao produto' })
  attachVariations(
    @Param('id') id: string,
    @Body() dto: AttachProductVariationsDto,
  ) {
    return this.service.attachVariations(id, dto);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Criar itens do produto' })
  createItems(@Param('id') id: string, @Body() dto: CreateProductItemsDto) {
    return this.service.createItems(id, dto);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Listar itens do produto' })
  listItems(@Param('id') id: string) {
    return this.service.listItems(id);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Atualizar estoque do item do produto' })
  updateItemStock(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateProductItemStockDto,
  ) {
    return this.service.updateItemStock(itemId, dto);
  }
}
