import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateVariationDto {
  @ApiPropertyOptional({ example: 'Teor de Nicotina' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: ['3mg', '20mg', '35mg', '50mg'] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  options?: string[];
}
