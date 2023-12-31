import { EnumUserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
  //   message: 'Phone must be a valid phone number',
  // })
  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(EnumUserType)
  userType: EnumUserType;
}
