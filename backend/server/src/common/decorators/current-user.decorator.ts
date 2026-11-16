import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract user info from JWT payload
 * @param data - specific field to extract (userId, email)
 * @returns user info from JWT payload
 */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
