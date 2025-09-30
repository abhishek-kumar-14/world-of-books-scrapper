import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from '../../database/schemas/product.schema'
import { ProductDetail, ProductDetailDocument } from '../../database/schemas/product-detail.schema'
import { SearchQueryDto } from './dto/search-query.dto'
import { ScrapingService } from '../scraping/scraping.service'
import { ScrapeJobType } from '../../database/schemas/scrape-job.schema'

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name)

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductDetail.name) private productDetailModel: Model<ProductDetailDocument>,
    private scrapingService: ScrapingService,
  ) {}

  async searchProducts(query: SearchQueryDto & { 
    minPrice?: number, 
    maxPrice?: number, 
    author?: string,
    minRating?: number 
  }) {
    const { q, page = 1, limit = 20, minPrice, maxPrice, author, minRating } = query
    const skip = (page - 1) * limit

    this.logger.log(`🔍 Searching for: "${q}" with filters (page: ${page}, limit: ${limit})`)

    // Auto-trigger search scraping if we have a query and no existing results
    if (q && q.trim()) {
      const existingCount = await this.productModel.countDocuments({
        $and: [
          { sourceId: { $regex: '^wob-search-', $options: 'i' } },
          { sourceId: { $regex: q.trim(), $options: 'i' } }
        ]
      }).exec()
      
      if (existingCount === 0) {
        this.logger.log(`🤖 Auto-triggering search scraping for: "${q}"`)
        this.scrapingService.queueScrapeJob({
          targetUrl: `https://www.worldofbooks.com/en-gb/search?q=${encodeURIComponent(q.trim())}`,
          targetType: ScrapeJobType.SEARCH,
          metadata: { query: q.trim() },
        }).catch(error => {
          this.logger.error(`Failed to auto-trigger search scraping for "${q}": ${error.message}`)
        })
      }
    }

    // Build search query with filters
    const searchQuery: any = {
      $and: [
        q ? {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { author: { $regex: q, $options: 'i' } }
          ]
        } : {},
        { sourceId: { $regex: '^wob-(real|search)-', $options: 'i' } } // Include both category and search results
      ]
    }

    // Add price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: any = {}
      if (minPrice !== undefined) priceFilter.$gte = minPrice
      if (maxPrice !== undefined) priceFilter.$lte = maxPrice
      searchQuery.$and.push({ price: priceFilter })
    }

    // Add author filter
    if (author) {
      searchQuery.$and.push({ author: { $regex: author, $options: 'i' } })
    }

    // Clean up empty objects
    searchQuery.$and = searchQuery.$and.filter(condition => Object.keys(condition).length > 0)

    const [products, total] = await Promise.all([
      this.productModel
        .find(searchQuery)
        .sort({ lastScrapedAt: -1, title: 1 }) // Sort by newest first, then alphabetically
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(searchQuery),
    ])

    // If rating filter is specified, get product details and filter
    let filteredProducts = products
    let filteredTotal = total

    if (minRating !== undefined) {
      const productIds = products.map(p => p._id)
      const productDetails = await this.productDetailModel
        .find({ 
          productId: { $in: productIds },
          ratingsAvg: { $gte: minRating }
        })
        .exec()
      
      const validProductIds = new Set(productDetails.map(pd => pd.productId.toString()))
      filteredProducts = products.filter(p => validProductIds.has(p._id.toString()))
      
      // Recalculate total for rating filter (approximate)
      filteredTotal = filteredProducts.length
    }

    this.logger.log(`🔍 Search results: ${filteredProducts.length} products found, ${filteredTotal} total`)
    
    return {
      data: filteredProducts.map(this.toDto),
      pagination: {
        page,
        limit,
        total: filteredTotal,
        pages: Math.ceil(filteredTotal / limit),
      },
      query: q || '',
      filters: {
        minPrice,
        maxPrice,
        author,
        minRating
      }
    }
  }

  private toDto(product: ProductDocument) {
    return {
      _id: product._id.toString(),
      sourceId: product.sourceId,
      title: product.title,
      author: product.author,
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl,
      sourceUrl: product.sourceUrl,
      lastScrapedAt: product.lastScrapedAt.toISOString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }
  }
}