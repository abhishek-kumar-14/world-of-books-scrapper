import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ScrapingService } from './scraping.service'
import { ScrapingController } from './scraping.controller'
import { WorldOfBooksScraperService } from './world-of-books-scraper.service'
import { ScrapeJob, ScrapeJobSchema } from '../../database/schemas/scrape-job.schema'
import { Navigation, NavigationSchema } from '../../database/schemas/navigation.schema'
import { Category, CategorySchema } from '../../database/schemas/category.schema'
import { Product, ProductSchema } from '../../database/schemas/product.schema'
import { ProductDetail, ProductDetailSchema } from '../../database/schemas/product-detail.schema'
import { Review, ReviewSchema } from '../../database/schemas/review.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScrapeJob.name, schema: ScrapeJobSchema },
      { name: Navigation.name, schema: NavigationSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: ProductDetail.name, schema: ProductDetailSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService, WorldOfBooksScraperService],
  exports: [ScrapingService],
})
export class ScrapingModule {}