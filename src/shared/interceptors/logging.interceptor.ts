import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, path } = request;
    const { statusCode } = response;

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`[${method}] ${path} - ${statusCode} took ${Date.now() - now}ms`)),
      );
  }
}
