import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Pod Descartavel 50k' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'uuid-da-categoria' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: ['https://img1.com', 'https://img2.com'],
  })
  @IsArray()
  images: string[];

  @ApiProperty({
    example: ['uuid-variacao-1', 'uuid-variacao-2'],
  })
  @IsArray()
  variationIds: string[];
}
