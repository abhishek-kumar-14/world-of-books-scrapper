import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export enum ScrapeJobType {
  NAVIGATION = 'navigation',
  CATEGORY = 'category',
  SEARCH = 'search',
  PRODUCT = 'product',
}

export enum ScrapeJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type ScrapeJobDocument = ScrapeJob & Document

@Schema({ timestamps: true })
export class ScrapeJob {
  @Prop({ required: true })
  targetUrl: string

  @Prop({ required: true, enum: ScrapeJobType })
  targetType: ScrapeJobType

  @Prop({ required: true, enum: ScrapeJobStatus, default: ScrapeJobStatus.PENDING })
  status: ScrapeJobStatus

  @Prop({ type: Object })
  metadata?: Record<string, any>

  @Prop()
  startedAt?: Date

  @Prop()
  finishedAt?: Date

  @Prop()
  errorLog?: string

  createdAt: Date
  updatedAt: Date
}

export const ScrapeJobSchema = SchemaFactory.createForClass(ScrapeJob)