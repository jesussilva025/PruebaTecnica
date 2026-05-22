import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Centralized HTTP error handling. Normalizes server/network failures
 * before the service layer surfaces them.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message =
        err.status === 0
          ? 'No fue posible conectar con el servidor.'
          : err.error?.message || `Error ${err.status}: ${err.statusText}`;
      console.error('[HTTP]', req.method, req.url, message);
      return throwError(() => new Error(message));
    }),
  );
