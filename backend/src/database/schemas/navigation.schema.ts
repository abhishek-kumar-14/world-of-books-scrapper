import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type NavigationDocument = Navigation & Document

@Schema({ timestamps: true })
export class Navigation {
  @Prop({ required: true })
  title: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ default: Date.now })
  lastScrapedAt: Date

  createdAt: Date
  updatedAt: Date
}

export const NavigationSchema = SchemaFactory.createForClass(Navigation)