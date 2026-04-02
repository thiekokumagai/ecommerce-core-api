import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 'uuid-ou-id' })
  id: string;

  @ApiProperty({ example: 'Descartáveis' })
  title: string;

  @ApiProperty({ example: 'https://minio.vendizap.com/vendizap-categorias/550a0eb3812c3e44071a03ea13cb0170.jpg' })
  image: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  updatedAt: Date;
}