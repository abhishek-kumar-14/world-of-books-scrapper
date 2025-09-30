import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Category, CategoryDocument } from '../../database/schemas/category.schema'
import { Navigation, NavigationDocument } from '../../database/schemas/navigation.schema'
import { Product, ProductDocument } from '../../database/schemas/product.schema'
import { CategoryDto } from './dto/category.dto'
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'
import { ScrapingService } from '../scraping/scraping.service'
import { ScrapeJobType } from '../../database/schemas/scrape-job.schema'

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Navigation.name) private navigationModel: Model<NavigationDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private scrapingService: ScrapingService,
  ) {}

  async findAll(query: PaginationQueryDto & { navigationId?: string }) {
    const { page = 1, limit = 20, navigationId } = query
    const skip = (page - 1) * limit

    const filter: any = {}
    if (navigationId) {
      filter.navigationId = navigationId
    }

    const [categories, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.categoryModel.countDocuments(filter),
    ])

    return {
      data: categories.map(this.toDto),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async findBySlug(slug: string): Promise<CategoryDto> {
    this.logger.log(`🔍 Looking for category with slug: "${slug}"`)
    
    // First try to find existing category
    let category = await this.categoryModel.findOne({ slug }).exec()
    this.logger.log(`📂 Found existing category: ${category ? 'YES' : 'NO'}`)
    
    if (!category) {
      // Try to find a navigation item with this slug
      const navigation = await this.navigationModel.findOne({ slug }).exec()
      this.logger.log(`🧭 Found navigation with slug "${slug}": ${navigation ? 'YES' : 'NO'}`)
      
      if (navigation) {
        this.logger.log(`✨ Creating category from navigation: ${navigation.title}`)
        
        // Create category from navigation item
        category = new this.categoryModel({
          navigationId: navigation._id,
          title: navigation.title,
          slug: navigation.slug,
          productCount: 0, // No products initially - must be scraped
          lastScrapedAt: new Date(),
        })
        
        const savedCategory = await category.save()
        this.logger.log(`💾 Saved new category: ${savedCategory.title}`)
        
        // Auto-trigger scraping for new category
        this.logger.log(`🤖 Auto-triggering scraping for new category: ${slug}`)
        this.scrapingService.queueScrapeJob({
          targetUrl: `https://www.worldofbooks.com/en-gb/category/${slug}`,
          targetType: ScrapeJobType.CATEGORY,
          metadata: { slug, loadMoreClicks: 0 },
        }).catch(error => {
          this.logger.error(`Failed to auto-trigger scraping for ${slug}: ${error.message}`)
        })
        
        return this.toDto(savedCategory)
      } else {
        // If no navigation found, create a basic category anyway
        this.logger.log(`🆕 Creating basic category for slug: "${slug}"`)
        
        category = new this.categoryModel({
          title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
          slug: slug,
          productCount: 0,
          lastScrapedAt: new Date(),
        })
        
        const savedCategory = await category.save()
        
        // Auto-trigger scraping for basic category too
        this.logger.log(`🤖 Auto-triggering scraping for basic category: ${slug}`)
        this.scrapingService.queueScrapeJob({
          targetUrl: `https://www.worldofbooks.com/en-gb/category/${slug}`,
          targetType: ScrapeJobType.CATEGORY,
          metadata: { slug, loadMoreClicks: 0 },
        }).catch(error => {
          this.logger.error(`Failed to auto-trigger scraping for ${slug}: ${error.message}`)
        })
        
        return this.toDto(savedCategory)
      }
    }

    this.logger.log(`✅ Returning category: ${category.title}`)
    return this.toDto(category)
  }

  async create(data: Partial<Category>): Promise<CategoryDto> {
    const category = new this.categoryModel(data)
    const saved = await category.save()
    return this.toDto(saved)
  }

  async updateLastScraped(slug: string): Promise<void> {
    await this.categoryModel
      .updateOne({ slug }, { lastScrapedAt: new Date() })
      .exec()
  }




  private toDto(category: CategoryDocument): CategoryDto {
    return {
      _id: category._id.toString(),
      navigationId: category.navigationId?.toString(),
      parentId: category.parentId?.toString(),
      title: category.title,
      slug: category.slug,
      productCount: category.productCount,
      lastScrapedAt: category.lastScrapedAt.toISOString(),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }
  }
}