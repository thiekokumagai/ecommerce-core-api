import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Descartáveis' })
  @IsString()
  @IsNotEmpty()
  title: string;


  @ApiProperty({ example: 'https://minio.vendizap.com/vendizap-categorias/550a0eb3812c3e44071a03ea13cb0170.jpg' })
  @IsString()
  image: string;
}