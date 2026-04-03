import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Descartáveis' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'https://.../image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
