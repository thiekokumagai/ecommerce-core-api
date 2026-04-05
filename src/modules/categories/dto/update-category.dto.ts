import { IsString, IsOptional, IsBoolean } from 'class-validator';
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
}
