import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type CategoryDocument = Category & Document

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: Types.ObjectId, ref: 'Navigation', required: true })
  navigationId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parentId?: Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  slug: string

  @Prop({ default: 0 })
  productCount: number

  @Prop({ default: Date.now })
  lastScrapedAt: Date

  createdAt: Date
  updatedAt: Date
}

export const CategorySchema = SchemaFactory.createForClass(Category)

// Create compound index for navigationId + slug uniqueness
CategorySchema.index({ navigationId: 1, slug: 1 }, { unique: true })