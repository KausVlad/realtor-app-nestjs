import { EnumPropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

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
