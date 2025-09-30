import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { NavigationService } from './navigation.service'
import { NavigationDto } from './dto/navigation.dto'

@ApiTags('navigation')
@Controller('navigation')
@UseGuards(ThrottlerGuard)
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all navigation items' })
  @ApiResponse({ status: 200, description: 'Navigation items retrieved successfully', type: [NavigationDto] })
  async findAll(): Promise<NavigationDto[]> {
    return this.navigationService.findAll()
  }

}