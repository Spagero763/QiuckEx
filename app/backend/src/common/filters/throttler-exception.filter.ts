import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * Standardizes 429 Too Many Requests error responses.
 */
@Catch(HttpException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      response.status(status).json({
        statusCode: status,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    } else {
      response.status(status).json(exception.getResponse());
    }
  }
}
