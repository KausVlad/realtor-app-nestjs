import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface ISignupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email, password }: ISignupParams) {
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
  }
}
