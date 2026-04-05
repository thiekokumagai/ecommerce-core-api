import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Descartáveis', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  @IsBoolean()
  isVisible?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  @IsBoolean()
  removeImage?: boolean;
}

export class UpdateOrderDto {
  @ApiProperty({
    example: [
      { id: 'uuid', order: 1 },
      { id: 'uuid', order: 2 },
    ],
  })
  @IsArray()
  items: {
    id: string;
    order: number;
  }[];
}