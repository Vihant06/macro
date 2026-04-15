import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
declare const OptionalAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OptionalAuthGuard extends OptionalAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    handle(err: any, user: any, info: any): any;
}
export {};
