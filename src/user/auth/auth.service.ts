import { ConflictException, Injectable } from '@nestjs/common';
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
      throw new ConflictException('User already exists');
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

    const token = await jwt.sign(
      { name, id: user.id },
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: '400d',
      },
    );

    return { token };
  }
}
