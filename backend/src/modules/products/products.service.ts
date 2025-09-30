import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from '../../database/schemas/product.schema'
import { ProductDetail, ProductDetailDocument } from '../../database/schemas/product-detail.schema'
import { Review, ReviewDocument } from '../../database/schemas/review.schema'
import { ProductDto } from './dto/product.dto'
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'
import { ScrapingService } from '../scraping/scraping.service'
import { ScrapeJobType } from '../../database/schemas/scrape-job.schema'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductDetail.name) private productDetailModel: Model<ProductDetailDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private scrapingService: ScrapingService,
  ) {}

  async findAll(query: PaginationQueryDto & { categorySlug?: string }) {
    const { page = 1, limit = 100, categorySlug } = query
    const skip = 0 // No pagination - load all products

    this.logger.log(`🔍 Finding products with categorySlug: "${categorySlug}", page: ${page}, limit: ${limit}`)

    // Auto-trigger scraping if no products found for this category
    if (categorySlug) {
      const existingCount = await this.productModel.countDocuments({
        sourceId: { $regex: `wob-real-.*${categorySlug}`, $options: 'i' }
      }).exec()
      
      if (existingCount === 0) {
        this.logger.log(`🤖 Auto-triggering scraping for category: ${categorySlug}`)
        // Trigger scraping in background - don't wait for it
        this.scrapingService.queueScrapeJob({
          targetUrl: `https://www.worldofbooks.com/en-gb/category/${categorySlug}`,
          targetType: ScrapeJobType.CATEGORY,
          metadata: { slug: categorySlug, loadMoreClicks: 0 },
        }).catch(error => {
          this.logger.error(`Failed to auto-trigger scraping for ${categorySlug}: ${error.message}`)
        })
      }
    }
    // Build filter - show ALL products if no category, or filter by category
    let filter: any = {
      sourceId: { $regex: '^wob-real-', $options: 'i' } // Only real scraped products
    }
    
    if (categorySlug) {
      // Filter by category slug in sourceId
      filter = {
        $and: [
          { sourceId: { $regex: '^wob-real-', $options: 'i' } }, // Must be real scraped product
          { sourceId: { $regex: categorySlug, $options: 'i' } }    // Must contain category name
        ]
      }
    }
    
    this.logger.log(`📂 Using filter:`, JSON.stringify(filter, null, 2))

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ lastScrapedAt: -1, title: 1 }) // Sort by scrape time, then title for consistency
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ])

    this.logger.log(`📊 Query results: ${products.length} products found, ${total} total`)

    return {
      data: products.map(this.toDto),
      pagination: {
        page: 1, // Always page 1 since we don't use pagination
        limit,
        total,
        pages: 1, // Always 1 page
      },
    }
  }

  async findByIdWithDetails(id: string) {
    this.logger.log(`🔍 Finding product by ID: ${id}`)
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      this.logger.error(`❌ Invalid ObjectId format: ${id}`)
      throw new NotFoundException(`Invalid product ID format`)
    }
    
    const product = await this.productModel.findById(id).exec()
    
    if (!product) {
      this.logger.error(`❌ Product not found with ID: ${id}`)
      throw new NotFoundException(`Product with ID "${id}" not found`)
    }

    this.logger.log(`✅ Found product: ${product.title}`)
    
    const [productDetail, reviews] = await Promise.all([
      this.productDetailModel.findOne({ productId: product._id }).exec(),
      this.reviewModel.find({ productId: product._id }).sort({ createdAt: -1 }).exec(),
    ])

    this.logger.log(`📊 Product details: ${productDetail ? 'Found' : 'Not found'}`)
    this.logger.log(`📝 Reviews found: ${reviews.length}`)
    
    return {
      product: this.toDto(product),
      productDetail: productDetail ? this.toDetailDto(productDetail) : null,
      reviews: reviews.map(this.toReviewDto),
    }
  }

  async create(data: Partial<Product>): Promise<ProductDto> {
    const product = new this.productModel(data)
    const saved = await product.save()
    return this.toDto(saved)
  }

  async getRecommendations(productId: string, limit: number = 4) {
    this.logger.log(`🔍 Getting recommendations for product: ${productId}`)
    
    // Get the current product to base recommendations on
    const currentProduct = await this.productModel.findById(productId).exec()
    if (!currentProduct) {
      this.logger.warn(`❌ Product not found for recommendations: ${productId}`)
      return []
    }

    this.logger.log(`📚 Current product: "${currentProduct.title}" by ${currentProduct.author}`)

    // Strategy 1: Find books by the same author
    let recommendations = await this.productModel
      .find({
        _id: { $ne: productId }, // Exclude current product
        author: currentProduct.author,
        sourceId: { $regex: '^wob-real-', $options: 'i' } // Only real products
      })
      .limit(2)
      .exec()

    this.logger.log(`👤 Found ${recommendations.length} books by same author`)

    // Strategy 2: Find books in similar price range (±20%)
    if (recommendations.length < limit) {
      const priceMin = currentProduct.price * 0.8
      const priceMax = currentProduct.price * 1.2
      
      const similarPriceBooks = await this.productModel
        .find({
          _id: { $ne: productId },
          $and: [
            { _id: { $nin: recommendations.map(r => r._id) } }, // Exclude already found
          ],
          price: { $gte: priceMin, $lte: priceMax },
          sourceId: { $regex: '^wob-real-', $options: 'i' }
        })
        .limit(limit - recommendations.length)
        .exec()

      recommendations = [...recommendations, ...similarPriceBooks]
      this.logger.log(`💰 Added ${similarPriceBooks.length} books in similar price range`)
    }

    // Strategy 3: Fill remaining slots with random popular books
    if (recommendations.length < limit) {
      const randomBooks = await this.productModel
        .aggregate([
          {
            $match: {
              $and: [
                { _id: { $ne: productId } },
                { _id: { $nin: recommendations.map(r => r._id) } },
              ],
              sourceId: { $regex: '^wob-real-', $options: 'i' }
            }
          },
          { $sample: { size: limit - recommendations.length } }
        ])
        .exec()

      recommendations = [...recommendations, ...randomBooks]
      this.logger.log(`🎲 Added ${randomBooks.length} random books to fill recommendations`)
    }

    this.logger.log(`✅ Total recommendations found: ${recommendations.length}`)
    return recommendations.slice(0, limit).map(this.toDto)
  }
  async updateLastScraped(sourceId: string): Promise<void> {
    await this.productModel
      .updateOne({ sourceId }, { lastScrapedAt: new Date() })
      .exec()
  }


  private toDto(product: ProductDocument): ProductDto {
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

  private toDetailDto(detail: ProductDetailDocument) {
    return {
      productId: detail.productId.toString(),
      description: detail.description,
      specs: detail.specs,
      ratingsAvg: detail.ratingsAvg,
      reviewsCount: detail.reviewsCount,
      publisher: detail.publisher,
      publicationDate: detail.publicationDate?.toISOString(),
      isbn: detail.isbn,
      createdAt: detail.createdAt.toISOString(),
      updatedAt: detail.updatedAt.toISOString(),
    }
  }

  private toReviewDto(review: ReviewDocument) {
    return {
      _id: review._id.toString(),
      productId: review.productId.toString(),
      author: review.author,
      rating: review.rating,
      text: review.text,
      createdAt: review.createdAt.toISOString(),
    }
  }
}