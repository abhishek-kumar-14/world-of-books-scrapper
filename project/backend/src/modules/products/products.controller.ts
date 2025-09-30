import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ProductsService } from './products.service'
import { ProductDto } from './dto/product.dto'
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'

@ApiTags('products')
@Controller('products')
@UseGuards(ThrottlerGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categorySlug', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() query: PaginationQueryDto & { categorySlug?: string }) {
    console.log(`[ProductsController] GET /products with query:`, query)
    try {
      const result = await this.productsService.findAll(query)
      console.log(`[ProductsController] Found ${result.data.length} products`)
      return result
    } catch (error) {
      console.error(`[ProductsController] Error finding products:`, error.message)
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID with details and reviews' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id') id: string) {
    console.log(`[ProductsController] GET /products/${id}`)
    try {
      const result = await this.productsService.findByIdWithDetails(id)
      console.log(`[ProductsController] Successfully found product: ${result.product.title}`)
      return result
    } catch (error) {
      console.error(`[ProductsController] Error finding product ${id}:`, error.message)
      throw error
    }
  }

  @Get(':id/recommendations')
  @ApiOperation({ summary: 'Get product recommendations' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recommendations to return' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved successfully' })
  async getRecommendations(
    @Param('id') id: string,
    @Query('limit') limit?: number
  ) {
    console.log(`[ProductsController] GET /products/${id}/recommendations`)
    try {
      const recommendations = await this.productsService.getRecommendations(id, limit || 4)
      console.log(`[ProductsController] Found ${recommendations.length} recommendations`)
      return { data: recommendations }
    } catch (error) {
      console.error(`[ProductsController] Error getting recommendations for ${id}:`, error.message)
      throw error
    }
  }

}