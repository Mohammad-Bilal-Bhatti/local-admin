import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, path } = request;
    const { statusCode } = response;

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`[${method}] ${path} - ${statusCode} took ${Date.now() - now}ms`)),
      );
  }
}
