import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ProductDetailDocument = ProductDetail & Document

@Schema({ timestamps: true })
export class ProductDetail {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, unique: true })
  productId: Types.ObjectId

  @Prop()
  description?: string

  @Prop({ type: Object })
  specs?: Record<string, any>

  @Prop()
  ratingsAvg?: number

  @Prop()
  reviewsCount?: number

  @Prop()
  publisher?: string

  @Prop()
  publicationDate?: Date

  @Prop()
  isbn?: string

  createdAt: Date
  updatedAt: Date
}

export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail)