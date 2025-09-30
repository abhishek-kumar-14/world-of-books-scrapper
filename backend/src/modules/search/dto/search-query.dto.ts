import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query string', required: false })
  @IsOptional()
  @IsString()
  q: string

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiProperty({ description: 'Items per page', required: false, default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 20

  @ApiProperty({ description: 'Minimum price filter', required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  minPrice?: number

  @ApiProperty({ description: 'Maximum price filter', required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number

  @ApiProperty({ description: 'Author filter', required: false })
  @IsOptional()
  @IsString()
  author?: string

  @ApiProperty({ description: 'Minimum rating filter', required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number
}