import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { Product, ProductSchema } from '../../database/schemas/product.schema'
import { ProductDetail, ProductDetailSchema } from '../../database/schemas/product-detail.schema'
import { ScrapingModule } from '../scraping/scraping.module'

@Module({
  imports: [
    ScrapingModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductDetail.name, schema: ProductDetailSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}