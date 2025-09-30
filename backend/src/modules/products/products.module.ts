import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { Product, ProductSchema } from '../../database/schemas/product.schema'
import { ProductDetail, ProductDetailSchema } from '../../database/schemas/product-detail.schema'
import { Review, ReviewSchema } from '../../database/schemas/review.schema'
import { ScrapingModule } from '../scraping/scraping.module'

@Module({
  imports: [
    ScrapingModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductDetail.name, schema: ProductDetailSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}