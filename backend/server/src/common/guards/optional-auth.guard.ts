import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Guard that optionally authenticates users
 * If JWT is provided and valid, user is authenticated
 * If no JWT or invalid, request continues without user context
 */
@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Try to authenticate, but don't fail if token is missing/invalid
    return super.canActivate(context);
  }

  handle(err: any, user: any, info: any): any {
    // Return user if authenticated, null if not
    return user || null;
  }
}
