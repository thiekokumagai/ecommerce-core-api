import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VariationsService } from './variations.service';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';

@ApiTags('Variations')
@ApiBearerAuth('access-token')
@Controller('variations')
export class VariationsController {
  constructor(private readonly service: VariationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar variação com opções' })
  @ApiResponse({ status: 201, description: 'Variação criada com sucesso' })
  create(@Body() body: CreateVariationDto) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar variações' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar variação por id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar variação' })
  update(@Param('id') id: string, @Body() body: UpdateVariationDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar variação' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
