import { EnumPropertyType, EnumUserType } from '@prisma/client';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { HomeService } from './home.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserInfo, UserInfo } from 'src/user/decorators/user.decorator';
import { UserRoles } from 'src/decorators/roles.decorator';
// import { Roles } from 'src/decorators/roles.decorator';

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

  @UserRoles(EnumUserType.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDto, @UserInfo() user: IUserInfo) {
    return this.homeService.createHome(body, user.id);
  }

  // buyer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImdyZWs0IiwiaWQiOjcsImlhdCI6MTY5MjQ2OTU5NywiZXhwIjoxNjkzMDc0Mzk3fQ.o98EFeo9kCg_Wti1SowfZHtSTN1xlAkAdWcLWYVZb1A

  // realtor eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImdyZWszIiwiaWQiOjYsImlhdCI6MTY5MjQ2ODIyMCwiZXhwIjoxNjkzMDczMDIwfQ.x1HLoGzagjGIZM0Qa7NA8NzMIPIXKuBqxPx0W_0g6hY

  @UserRoles(EnumUserType.REALTOR)
  @Put(':id')
  async updateHomeById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @UserInfo() user: IUserInfo,
  ) {
    const { realtor } = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException('You are not the realtor of this home');
    }
    return this.homeService.updateHomeById(id, body);
  }

  @UserRoles(EnumUserType.REALTOR)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() user: IUserInfo,
  ) {
    const { realtor } = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException('You are not the realtor of this home');
    }
    return this.homeService.deleteHome(id);
  }

  @UserRoles(EnumUserType.BUYER)
  @Post('inquire/:homeId')
  inquire(
    @Param('homeId', ParseIntPipe) homeId: number,
    @UserInfo() user: IUserInfo,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }
}
