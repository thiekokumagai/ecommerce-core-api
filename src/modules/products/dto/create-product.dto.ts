import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Produto X' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'uuid-da-categoria' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: 49.9 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 39.9 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  promotionalPrice?: number;

  @ApiPropertyOptional({ example: 25.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice?: number;
}
