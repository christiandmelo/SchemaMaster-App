import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if(this.tokenService.hasToken()){
      const token = this.tokenService.getToken();
      const headers = request.headers.append('Authorization', token);
      request = request.clone({headers});
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        return this.handleAuthError(err);
      })
    )
  }

  private handleAuthError(resp: HttpErrorResponse): Observable<HttpEvent<unknown>> {

    if (resp.status === 401 || resp.status === 403) {
        this.tokenService.deleteToken();
        return new Observable<HttpEvent<unknown>>();
    }

    try {
        if (typeof resp.error === "string")
        {
          this.snackBar.open('An error occurred: ' + resp.error, 'ok', {
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
        else 
        {
          this.snackBar.open('An error occurred: ' + resp.error.data.message, 'ok', {
            horizontalPosition: "center",
            verticalPosition: "top",
          });
        }
    } catch {
      this.snackBar.open('An unexpected system error has occurred. Try again later.', 'ok', {
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }

    console.log(resp.error);

    return throwError(resp);
  }
}
