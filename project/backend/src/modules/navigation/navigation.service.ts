import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Navigation, NavigationDocument } from '../../database/schemas/navigation.schema'
import { NavigationDto } from './dto/navigation.dto'

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name)

  constructor(
    @InjectModel(Navigation.name) private navigationModel: Model<NavigationDocument>,
  ) {}

  async findAll(): Promise<NavigationDto[]> {
    const navigation = await this.navigationModel
      .find()
      .sort({ title: 1 })
      .exec()

    this.logger.log(`Found ${navigation.length} navigation items`)
    return navigation.map(this.toDto)
  }

  async create(data: Partial<Navigation>): Promise<NavigationDto> {
    const navigation = new this.navigationModel(data)
    const saved = await navigation.save()
    return this.toDto(saved)
  }

  async updateLastScraped(slug: string): Promise<void> {
    await this.navigationModel
      .updateOne({ slug }, { lastScrapedAt: new Date() })
      .exec()
  }


  private toDto(navigation: NavigationDocument): NavigationDto {
    return {
      _id: navigation._id.toString(),
      title: navigation.title,
      slug: navigation.slug,
      lastScrapedAt: navigation.lastScrapedAt.toISOString(),
      createdAt: navigation.createdAt.toISOString(),
      updatedAt: navigation.updatedAt.toISOString(),
    }
  }
}