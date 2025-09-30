import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ScrapeJob, ScrapeJobDocument, ScrapeJobType, ScrapeJobStatus } from '../../database/schemas/scrape-job.schema'
import { WorldOfBooksScraperService } from './world-of-books-scraper.service'

interface QueueScrapeJobData {
  targetUrl: string
  targetType: ScrapeJobType
  metadata?: Record<string, any>
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name)

  constructor(
    @InjectModel(ScrapeJob.name) private scrapeJobModel: Model<ScrapeJobDocument>,
    private worldOfBooksScraperService: WorldOfBooksScraperService,
  ) {}

  async queueScrapeJob(data: QueueScrapeJobData): Promise<string> {
    // Create job record in database
    const scrapeJob = new this.scrapeJobModel({
      targetUrl: data.targetUrl,
      targetType: data.targetType,
      status: ScrapeJobStatus.PENDING,
      metadata: data.metadata,
    })

    const savedJob = await scrapeJob.save()
    const jobId = savedJob._id.toString()

    this.logger.log(`🚀 Starting REAL scraping job ${jobId} for ${data.targetUrl}`)
    this.logger.log(`📋 Job metadata:`, data.metadata)

    // Execute scraping immediately (no queue)
    this.executeScrapeJob(jobId, data).catch(error => {
      this.logger.error(`❌ Scraping job ${jobId} failed: ${error.message}`)
      this.logger.error(`❌ Full error:`, error)
    })

    return jobId
  }

  private async executeScrapeJob(jobId: string, data: QueueScrapeJobData): Promise<void> {
    this.logger.log(`🔄 Executing scrape job ${jobId} - Type: ${data.targetType}`)
    
    try {
      await this.updateJobStatus(jobId, ScrapeJobStatus.PROCESSING)
      
      switch (data.targetType) {
        case ScrapeJobType.NAVIGATION:
          this.logger.log(`🧭 Executing navigation scraping for ${data.targetUrl}`)
          await this.worldOfBooksScraperService.scrapeNavigation(data.targetUrl)
          break
        case ScrapeJobType.CATEGORY:
          this.logger.log(`📂 Executing category scraping for ${data.targetUrl}`)
          this.logger.log(`📂 Category metadata:`, data.metadata)
          await this.worldOfBooksScraperService.scrapeCategory(data.targetUrl, data.metadata)
          break
        case ScrapeJobType.PRODUCT:
          this.logger.log(`📖 Executing product scraping for ${data.targetUrl}`)
          await this.worldOfBooksScraperService.scrapeProduct(data.targetUrl, data.metadata)
          break
        case ScrapeJobType.SEARCH:
          this.logger.log(`🔍 Executing search scraping for ${data.targetUrl}`)
          await this.worldOfBooksScraperService.scrapeSearch(data.targetUrl, data.metadata)
          break
        default:
          throw new Error(`Unknown scrape job type: ${data.targetType}`)
      }
      
      await this.updateJobStatus(jobId, ScrapeJobStatus.COMPLETED)
      this.logger.log(`✅ Completed scrape job ${jobId}`)
      
    } catch (error) {
      this.logger.error(`❌ Failed scrape job ${jobId}: ${error.message}`)
      this.logger.error(`❌ Error stack:`, error.stack)
      await this.updateJobStatus(
        jobId, 
        ScrapeJobStatus.FAILED, 
        error.message
      )
      throw error
    }
  }

  async updateJobStatus(jobId: string, status: ScrapeJobStatus, errorLog?: string): Promise<void> {
    const updateData: any = { status }
    
    if (status === ScrapeJobStatus.PROCESSING) {
      updateData.startedAt = new Date()
    } else if (status === ScrapeJobStatus.COMPLETED || status === ScrapeJobStatus.FAILED) {
      updateData.finishedAt = new Date()
    }
    
    if (errorLog) {
      updateData.errorLog = errorLog
    }

    await this.scrapeJobModel.updateOne({ _id: jobId }, updateData).exec()
  }

  async getJobStatus(jobId: string): Promise<ScrapeJobDocument | null> {
    return this.scrapeJobModel.findById(jobId).exec()
  }
}