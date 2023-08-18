import { EnumPropertyType } from '@prisma/client';
import { CreateHomeDto, HomeResponseDto } from './dto/home.dto';
import { HomeService } from './home.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('property_type') property_type?: EnumPropertyType,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(property_type && { property_type }),
      ...(price && { price }),
    };
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHomeById(@Param('id') id: number) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  createHome(@Body() body: CreateHomeDto) {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete(':id')
  deleteHome() {
    return {};
  }
}
