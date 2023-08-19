import { SetMetadata } from '@nestjs/common';
import { EnumUserType } from '@prisma/client';

export const UserRoles = (...roles: EnumUserType[]) => {
  return SetMetadata('roles', roles);
};
