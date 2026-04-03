import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { VariationsService } from './variations.service';

@Controller('variations')
export class VariationsController {
  constructor(private readonly service: VariationsService) {}

  // 📦 CREATE
  @Post()
  create(@Body() body: { title: string }) {
    return this.service.create(body);
  }

  // 📃 LISTAGEM (com paginação)
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.findAll(Number(page) || 1, Number(limit) || 10);
  }

  // 🔍 FIND ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✏️ UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { title?: string }) {
    return this.service.update(id, body);
  }

  // 🗑️ DELETE (soft delete)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
