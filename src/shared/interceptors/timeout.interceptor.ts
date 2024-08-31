import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    constructor(private readonly configService: ConfigService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const timeoutMs = this.configService.get<number>('timeout');
        return next.handle().pipe(
            timeout(timeoutMs),
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(new RequestTimeoutException());
                }
                return throwError(err);
            }),
        );
    };
};
