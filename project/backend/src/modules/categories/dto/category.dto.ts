import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator'

export class CategoryDto {
  @ApiProperty({ description: 'Category ID' })
  @IsString()
  _id: string

  @ApiProperty({ description: 'Navigation ID this category belongs to' })
  @IsString()
  navigationId: string

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsOptional()
  @IsString()
  parentId?: string

  @ApiProperty({ description: 'Category title' })
  @IsString()
  title: string

  @ApiProperty({ description: 'URL-friendly slug' })
  @IsString()
  slug: string

  @ApiProperty({ description: 'Number of products in this category' })
  @IsNumber()
  productCount: number

  @ApiProperty({ description: 'Last time this category was scraped' })
  @IsDateString()
  lastScrapedAt: string

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string

  @ApiProperty({ description: 'Last update timestamp' })
  @IsDateString()
  updatedAt: string
}