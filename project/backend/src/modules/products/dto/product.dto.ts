import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsDateString, IsOptional, IsUrl } from 'class-validator'

export class ProductDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  _id: string

  @ApiProperty({ description: 'Source ID from the scraped site' })
  @IsString()
  sourceId: string

  @ApiProperty({ description: 'Product title' })
  @IsString()
  title: string

  @ApiProperty({ description: 'Product author', required: false })
  @IsOptional()
  @IsString()
  author?: string

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  price: number

  @ApiProperty({ description: 'Price currency' })
  @IsString()
  currency: string

  @ApiProperty({ description: 'Product image URL', required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string

  @ApiProperty({ description: 'Source URL from the scraped site' })
  @IsUrl()
  sourceUrl: string

  @ApiProperty({ description: 'Last time this product was scraped' })
  @IsDateString()
  lastScrapedAt: string

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string

  @ApiProperty({ description: 'Last update timestamp' })
  @IsDateString()
  updatedAt: string
}