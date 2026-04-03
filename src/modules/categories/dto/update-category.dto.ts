import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Descartáveis', required: false })
  @IsOptional()
  @IsString()
  title?: string;
}
