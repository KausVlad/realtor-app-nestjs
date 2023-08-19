import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { EnumPropertyType } from '@prisma/client';
import { IUserInfo } from 'src/user/decorators/user.decorator';

interface IGetHomesParams {
  city?: string;
  property_type?: EnumPropertyType;
  price?: {
    gte?: number;
    lte?: number;
  };
}

interface ICreateHomeParams {
  address: string;
  city: string;
  price: number;
  landSize: number;
  numbersFBathrooms: number;
  numbersOfBedrooms: number;
  propertyType: EnumPropertyType;
  images: { url: string }[];
}

interface IUpdateHomeParams
  extends Omit<Partial<ICreateHomeParams>, 'images'> {}

const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  property_type: true,
  numbers_of_bathrooms: true,
  numbers_of_bedrooms: true,
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: IGetHomesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        numbers_of_bedrooms: true,
        numbers_of_bathrooms: true,
        price: true,
        property_type: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });

    if (!homes.length) {
      throw new NotFoundException('No homes found, by your filters');
    }
    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id: id },
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found');
    }
    return new HomeResponseDto(home);
  }

  async createHome(
    {
      address,
      city,
      price,
      landSize,
      numbersFBathrooms,
      numbersOfBedrooms,
      propertyType,
      images,
    }: ICreateHomeParams,
    userId: number,
  ) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        price,
        land_size: landSize,
        numbers_of_bathrooms: numbersFBathrooms,
        numbers_of_bedrooms: numbersOfBedrooms,
        property_type: propertyType,
        realtor_id: userId,
      },
    });

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return new HomeResponseDto(home);
  }

  async updateHomeById(id: number, data: IUpdateHomeParams) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found');
    }

    const updateHome = await this.prismaService.home.update({
      where: {
        id: id,
      },
      data,
    });

    return new HomeResponseDto(updateHome);
  }

  async deleteHome(id: number) {
    const deletedHome = await this.prismaService.home.findFirst({
      where: {
        id,
      },
    });

    if (!deletedHome) {
      throw new NotFoundException('Home not found');
    }

    await this.prismaService.image.deleteMany({
      where: {
        home_id: id,
      },
    });

    await this.prismaService.home.delete({
      where: {
        id,
      },
    });

    return { deletedHome: new HomeResponseDto(deletedHome) };
  }

  async getRealtorByHomeId(id: number) {
    const realtor = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
      select: {
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
            id: true,
          },
        },
      },
    });

    if (!realtor) {
      throw new NotFoundException('Home not found');
    }

    return realtor;
  }

  async inquire(buyer: IUserInfo, homeId: number, message: string) {
    const { realtor } = await this.getRealtorByHomeId(homeId);

    return this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        message,
      },
    });
  }
}
