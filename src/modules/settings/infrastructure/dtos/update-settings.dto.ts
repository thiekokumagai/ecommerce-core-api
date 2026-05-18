import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ example: 'Pode Mais' })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({ example: 'https://cdn.example.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string | null;

  @ApiProperty({ example: 'https://cdn.example.com/favicon.ico', required: false })
  @IsString()
  @IsOptional()
  faviconUrl?: string | null;

  @ApiProperty({ example: 'Frete grátis em compras acima de R$ 150!', required: false })
  @IsString()
  @IsOptional()
  topHeaderText?: string | null;

  @ApiProperty({ example: ['https://cdn.example.com/banner1.png'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bannerUrls?: string[];

  @ApiProperty({ example: '(67) 99999-9999' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '@podemais.cg', required: false })
  @IsString()
  @IsOptional()
  instagram?: string | null;

  // Endereço
  @ApiProperty({ example: '79002-075' })
  @IsString()
  @IsNotEmpty()
  cep: string;

  @ApiProperty({ example: 'Rua 14 de Julho' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ example: 'Campo Grande' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'MS' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Sala 3', required: false })
  @IsString()
  @IsOptional()
  complement?: string | null;

  @ApiProperty({ example: false })
  @IsBoolean()
  hideAddress: boolean;

  // Pagamentos
  @ApiProperty({ example: true })
  @IsBoolean()
  pixEnabled: boolean;

  @ApiProperty({ example: 'EMAIL', required: false })
  @IsString()
  @IsOptional()
  pixKeyType?: string | null;

  @ApiProperty({ example: 'podemais@email.com', required: false })
  @IsString()
  @IsOptional()
  pixKey?: string | null;

  @ApiProperty({ example: 'Pode Mais E-commerce LTDA', required: false })
  @IsString()
  @IsOptional()
  pixHolder?: string | null;

  @ApiProperty({ example: true })
  @IsBoolean()
  payOnDeliveryCash: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  payOnDeliveryCardDebit: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  payOnDeliveryCardCredit: boolean;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  paymentRules?: any;
}
