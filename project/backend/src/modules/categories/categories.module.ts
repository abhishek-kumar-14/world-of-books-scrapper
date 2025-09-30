import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { Category, CategorySchema } from '../../database/schemas/category.schema'
import { Navigation, NavigationSchema } from '../../database/schemas/navigation.schema'
import { Product, ProductSchema } from '../../database/schemas/product.schema'
import { ScrapingModule } from '../scraping/scraping.module'

@Module({
  imports: [
    ScrapingModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Navigation.name, schema: NavigationSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}