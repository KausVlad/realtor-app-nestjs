import { Test, TestingModule } from '@nestjs/testing';
import { HomeService, homeSelect } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnumPropertyType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockGetHome = [
  {
    id: 7,
    address: 'address 1',
    city: 'Kyiv',
    price: 40,
    image: 'url3',
    numbers_of_bedrooms: 2,
    numbers_of_bathrooms: 2,
    property_type: EnumPropertyType.RESIDENTIAL,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

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

const mockImages = [
  {
    id: 1,
    url: 'src1',
  },
  {
    id: 2,
    url: 'src2',
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHome),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Kyiv',
      property_type: EnumPropertyType.RESIDENTIAL,
      price: {
        gte: 20,
        lte: 100,
      },
    };
    it('should call prisma findMany with the correct parameters', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHome);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('should throw a NotFoundException if no homes are found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('cerateHome', () => {
    const mockCreateHomeParams = {
      address: 'address 1',
      city: 'Kyiv',
      price: 40,
      landSize: 100,
      numbersFBathrooms: 2,
      numbersOfBedrooms: 2,
      propertyType: EnumPropertyType.RESIDENTIAL,
      images: [
        {
          url: 'src1',
        },
      ],
    };

    it('should call prisma home.create with the correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      await service.createHome(mockCreateHomeParams, 2);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: mockCreateHomeParams.address,
          city: mockCreateHomeParams.city,
          price: mockCreateHomeParams.price,
          land_size: mockCreateHomeParams.landSize,
          numbers_of_bathrooms: mockCreateHomeParams.numbersFBathrooms,
          numbers_of_bedrooms: mockCreateHomeParams.numbersOfBedrooms,
          property_type: mockCreateHomeParams.propertyType,
          realtor_id: 2,
        },
      });
    });

    it('should call prisma home.createMany with the correct payload', async () => {
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImage);

      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateManyImage).toBeCalledWith({
        data: [
          {
            url: 'src1',
            home_id: 7,
          },
        ],
      });
    });
  });
});
