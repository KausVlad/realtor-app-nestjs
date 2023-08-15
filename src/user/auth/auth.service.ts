import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { EnumUserType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

interface ISignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface ISignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async signup({ email, password, name, phone }: ISignupParams) {
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists) {
      throw new HttpException('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: EnumUserType.BUYER,
      },
    });

    return this.generateJWT(name, user.id);
  }

  async signIn({ email, password }: ISignInParams) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    return this.generateJWT(user.name, user.id);
  }

  private generateJWT(userName: string, id: number) {
    return jwt.sign(
      { userName, id: id },
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: '7d',
      },
    );
  }

  generateProductKey(email: string, userType: EnumUserType) {
    const string = `${email}-${userType}-${this.configService.get(
      'PRODUCT_KEY_SECRET',
    )}`;

    return bcrypt.hash(string, 10);
  }
}
