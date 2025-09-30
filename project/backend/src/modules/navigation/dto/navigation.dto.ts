import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDateString } from 'class-validator'

export class NavigationDto {
  @ApiProperty({ description: 'Navigation ID' })
  @IsString()
  _id: string

  @ApiProperty({ description: 'Navigation title' })
  @IsString()
  title: string

  @ApiProperty({ description: 'URL-friendly slug' })
  @IsString()
  slug: string

  @ApiProperty({ description: 'Last time this navigation was scraped' })
  @IsDateString()
  lastScrapedAt: string

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: string

  @ApiProperty({ description: 'Last update timestamp' })
  @IsDateString()
  updatedAt: string
}