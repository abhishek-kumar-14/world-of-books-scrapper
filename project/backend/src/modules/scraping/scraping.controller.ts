import { Controller, Post, Get, Param, UseGuards, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ScrapingService } from './scraping.service'
import { ScrapeJobType } from '../../database/schemas/scrape-job.schema'


@ApiTags('scraping')
@Controller('scraping')
@UseGuards(ThrottlerGuard)
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('navigation')
  @ApiOperation({ summary: 'Trigger navigation scraping' })
  @ApiResponse({ status: 201, description: 'Scraping job queued successfully' })
  async scrapeNavigation() {
    const jobId = await this.scrapingService.queueScrapeJob({
      targetUrl: 'https://www.worldofbooks.com/en-gb',
      targetType: ScrapeJobType.NAVIGATION,
    })
    return { jobId, message: 'Navigation scraping job queued' }
  }

  @Post('category/:slug')
  @ApiOperation({ summary: 'Trigger category scraping' })
  @ApiResponse({ status: 201, description: 'Category scraping job queued successfully' })
  async scrapeCategory(@Param('slug') slug: string, @Body() body?: { loadMoreClicks?: number }) {
    const loadMoreClicks = body?.loadMoreClicks || 0
    const jobId = await this.scrapingService.queueScrapeJob({
      targetUrl: `https://www.worldofbooks.com/en-gb/category/${slug}`,
      targetType: ScrapeJobType.CATEGORY,
      metadata: { slug, loadMoreClicks },
    })
    return { jobId, message: `Category ${slug} scraping job queued with ${loadMoreClicks} Load More clicks` }
  }

  @Post('product/:sourceId')
  @ApiOperation({ summary: 'Trigger product scraping' })
  @ApiResponse({ status: 201, description: 'Product scraping job queued successfully' })
  async scrapeProduct(@Param('sourceId') sourceId: string) {
    const jobId = await this.scrapingService.queueScrapeJob({
      targetUrl: `https://www.worldofbooks.com/en-gb/books/${sourceId}`,
      targetType: ScrapeJobType.PRODUCT,
      metadata: { sourceId },
    })
    return { jobId, message: `Product ${sourceId} scraping job queued` }
  }

  @Post('search/:query')
  @ApiOperation({ summary: 'Trigger search scraping' })
  @ApiResponse({ status: 201, description: 'Search scraping job queued successfully' })
  async scrapeSearch(@Param('query') query: string) {
    const jobId = await this.scrapingService.queueScrapeJob({
      targetUrl: `https://www.worldofbooks.com/en-gb/search?q=${encodeURIComponent(query)}`,
      targetType: ScrapeJobType.SEARCH,
      metadata: { query },
    })
    return { jobId, message: `Search "${query}" scraping job queued` }
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get scraping job status' })
  @ApiResponse({ status: 200, description: 'Job status retrieved successfully' })
  async getJobStatus(@Param('jobId') jobId: string) {
    const job = await this.scrapingService.getJobStatus(jobId)
    return job
  }
}