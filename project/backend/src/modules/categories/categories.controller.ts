import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { CategoriesService } from './categories.service'
import { CategoryDto } from './dto/category.dto'
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'

@ApiTags('categories')
@Controller('categories')
@UseGuards(ThrottlerGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'navigationId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAll(@Query() query: PaginationQueryDto & { navigationId?: string }) {
    return this.categoriesService.findAll(query)
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findBySlug(@Param('slug') slug: string): Promise<CategoryDto> {
    console.log(`[CategoriesController] GET /categories/${slug}`)
    try {
      return await this.categoriesService.findBySlug(slug)
    } catch (error) {
      console.error(`[CategoriesController] Error finding category ${slug}:`, error.message)
      throw error
    }
  }

}