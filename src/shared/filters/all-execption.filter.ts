import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly ignoreList: string[] = ['ERR_HTTP_HEADERS_SENT'];
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: Error, host: ArgumentsHost): void {
        if (this.ignoreList.includes(exception['code'])) return;

        console.error(`[${AllExceptionsFilter.name}] catght an exception: `, exception);
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const error = {
            name: exception.name,
            message: exception.message,
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            method: httpAdapter.getRequestMethod(ctx.getRequest()),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.status(ctx.getResponse(), httpStatus);
        httpAdapter.render(ctx.getResponse(), 'error', { error });
    }
}