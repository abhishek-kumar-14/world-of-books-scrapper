import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { ScrapingService } from './scraping.service'
import { WorldOfBooksScraperService } from './world-of-books-scraper.service'
import { ScrapeJobStatus, ScrapeJobType } from '../../database/schemas/scrape-job.schema'

@Processor('scraping')
export class ScrapingProcessor {
  private readonly logger = new Logger(ScrapingProcessor.name)

  constructor(
    private scrapingService: ScrapingService,
    private worldOfBooksScraperService: WorldOfBooksScraperService,
  ) {}

  @Process('scrape')
  async handleScrapeJob(job: Job) {
    const { jobId, targetUrl, targetType, metadata } = job.data
    
    this.logger.log(`Processing scrape job ${jobId} for ${targetUrl}`)
    
    try {
      await this.scrapingService.updateJobStatus(jobId, ScrapeJobStatus.PROCESSING)
      
      switch (targetType) {
        case ScrapeJobType.NAVIGATION:
          await this.worldOfBooksScraperService.scrapeNavigation(targetUrl)
          break
        case ScrapeJobType.CATEGORY:
          await this.worldOfBooksScraperService.scrapeCategory(targetUrl, metadata)
          break
        case ScrapeJobType.PRODUCT:
          await this.worldOfBooksScraperService.scrapeProduct(targetUrl, metadata)
          break
        default:
          throw new Error(`Unknown scrape job type: ${targetType}`)
      }
      
      await this.scrapingService.updateJobStatus(jobId, ScrapeJobStatus.COMPLETED)
      this.logger.log(`Completed scrape job ${jobId}`)
      
    } catch (error) {
      this.logger.error(`Failed scrape job ${jobId}: ${error.message}`)
      await this.scrapingService.updateJobStatus(
        jobId, 
        ScrapeJobStatus.FAILED, 
        error.message
      )
      throw error
    }
  }
}