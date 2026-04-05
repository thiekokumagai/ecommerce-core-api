import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Descartáveis' })
  title: string;

  @ApiProperty({
    example: 'https://bucket/uploads/123.png',
    nullable: true,
  })
  image: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isVisible: boolean;
}
