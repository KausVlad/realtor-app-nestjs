import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnumPropertyType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 82,
  name: 'John Doe',
  email: 'jJQzr@example.com',
  phone: '+380123456789',
};

const mockHome = {
  id: 7,
  address: 'address 1',
  city: 'Kyiv',
  price: 40,
  image: 'url3',
  numbers_of_bedrooms: 2,
  numbers_of_bathrooms: 2,
  property_type: EnumPropertyType.RESIDENTIAL,
};

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Kyiv', EnumPropertyType.RESIDENTIAL, '200');

      expect(mockGetHomes).toBeCalledWith({
        city: 'Kyiv',
        property_type: EnumPropertyType.RESIDENTIAL,
        price: {
          lte: 200,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUserInfo = {
      id: 82,
      name: 'John Doe',
      iat: 2,
      exp: 3,
    };

    const mockCreateHomeParams = {
      address: 'address 1',
      city: 'Kyiv',
      price: 40,
      landSize: 100,
      numbersFBathrooms: 2,
      numbersOfBedrooms: 2,
      propertyType: EnumPropertyType.RESIDENTIAL,
    };
    it("should throw unauthorized error if realtor didn't create home", async () => {
      await expect(
        controller.updateHome(5, mockCreateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
