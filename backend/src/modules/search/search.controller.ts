import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { SearchService } from './search.service'
import { SearchQueryDto } from './dto/search-query.dto'

@ApiTags('search')
@Controller('search')
@UseGuards(ThrottlerGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search products by query' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price filter' })
  @ApiQuery({ name: 'author', required: false, type: String, description: 'Author filter' })
  @ApiQuery({ name: 'minRating', required: false, type: Number, description: 'Minimum rating filter' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async search(@Query() query: SearchQueryDto & { 
    minPrice?: number, 
    maxPrice?: number, 
    author?: string,
    minRating?: number 
  }) {
    return this.searchService.searchProducts(query)
  }
}