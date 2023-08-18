import { EnumPropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDto {
  id: number;
  address: string;

  @Exclude()
  numbers_of_bedrooms: number;

  @Expose({ name: 'numbersOfBedrooms' })
  numbersOfBedrooms() {
    return this.numbers_of_bathrooms;
  }

  @Exclude()
  numbers_of_bathrooms: number;

  @Expose({ name: 'numbersOfBathrooms' })
  numbersOfBathrooms() {
    return this.numbers_of_bathrooms;
  }

  city: string;

  @Exclude()
  listed_date: Date;

  price: number;

  image: string;

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  property_type: EnumPropertyType;

  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsNumber()
  @IsPositive()
  numbersFBathrooms: number;

  @IsNumber()
  @IsPositive()
  numbersOfBedrooms: number;

  @IsEnum(EnumPropertyType)
  propertyType: EnumPropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}
