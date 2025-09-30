import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsNumber, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class PaginationQueryDto {
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
}