import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface ISignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email }: ISignupParams) {
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
  }
}
