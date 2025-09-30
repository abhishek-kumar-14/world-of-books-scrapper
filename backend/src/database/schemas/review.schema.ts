import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ReviewDocument = Review & Document

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId

  @Prop({ required: true })
  author: string

  @Prop({ required: true, min: 1, max: 5 })
  rating: number

  @Prop({ required: true })
  text: string

  createdAt: Date
}

export const ReviewSchema = SchemaFactory.createForClass(Review)