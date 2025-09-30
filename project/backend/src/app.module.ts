import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerModule } from '@nestjs/throttler'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from './common/logger/winston.config'
import { NavigationModule } from './modules/navigation/navigation.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { ProductsModule } from './modules/products/products.module'
import { SearchModule } from './modules/search/search.module'
import { ScrapingModule } from './modules/scraping/scraping.module'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/product-explorer',
    ),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Logging
    WinstonModule.forRoot(winstonConfig),

    // Feature modules
    NavigationModule,
    CategoriesModule,
    ProductsModule,
    SearchModule,
    ScrapingModule,
    HealthModule,
  ],
})
export class AppModule {}