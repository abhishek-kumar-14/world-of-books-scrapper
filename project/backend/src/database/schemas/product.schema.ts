import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ProductDocument = Product & Document

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  sourceId: string

  @Prop({ required: true })
  title: string

  @Prop()
  author?: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true, default: 'GBP' })
  currency: string

  @Prop()
  imageUrl?: string

  @Prop({ required: true, unique: true })
  sourceUrl: string

  @Prop({ default: Date.now })
  lastScrapedAt: Date

  createdAt: Date
  updatedAt: Date
}

export const ProductSchema = SchemaFactory.createForClass(Product)

// Create text index for search
ProductSchema.index({ title: 'text', author: 'text' })