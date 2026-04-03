import { ApiProperty } from '@nestjs/swagger';

class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;
}

class ImageDto {
  @ApiProperty()
  url: string;
}

class VariationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[];

  @ApiProperty({ type: [VariationDto] })
  variations: VariationDto[];
}
