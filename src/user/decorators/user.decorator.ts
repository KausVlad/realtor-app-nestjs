import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface IUserInfo {
  id: number;
  name: string;
  iat: number;
  exp: number;
}
export const UserInfo = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
