import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class InjectRequestContextInterceptor implements NestInterceptor {
  intercept(econtext: ExecutionContext, next: CallHandler) {
    const request: Request = econtext.switchToHttp().getRequest();
    const { path, query, params } = request;

    const location = { path, query, params };

    return next.handle().pipe(
      map((data) => {
        if (!data) data = {};
        Object.assign(data, { location });
        return data;
      }),
    );
  }
}
