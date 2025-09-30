import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ScrapingService } from './modules/scraping/scraping.service'
import { ScrapeJobType } from './database/schemas/scrape-job.schema'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Product Explorer API')
    .setDescription('API for exploring products from World of Books')
    .setVersion('1.0')
    .addTag('navigation', 'Navigation endpoints')
    .addTag('categories', 'Category endpoints')
    .addTag('products', 'Product endpoints')
    .addTag('search', 'Search endpoints')
    .addTag('scraping', 'Scraping endpoints')
    .addTag('health', 'Health check endpoints')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)
  const httpAdapter = app.getHttpAdapter()
  httpAdapter.get('/api/docs-json', (req, res) => res.json(document))

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 Application is running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)

  // Auto-trigger navigation scraping only if explicitly enabled (respecting TOS/robots)
  if (process.env.SCRAPING_ENABLED === 'true') {
  setTimeout(async () => {
    try {
      const scrapingService = app.get(ScrapingService)
      console.log('🤖 Auto-triggering navigation scraping...')
      await scrapingService.queueScrapeJob({
        targetUrl: 'https://www.worldofbooks.com/en-gb',
        targetType: ScrapeJobType.NAVIGATION,
      })
    } catch (error) {
      console.log('⚠️ Auto-scraping failed, but app continues normally')
    }
  }, 5000) // Wait 5 seconds after startup)
  } else {
    console.log('⏸️  Auto-scraping disabled. Set SCRAPING_ENABLED=true after confirming TOS and robots.txt compliance.')
  }
}

bootstrap()