import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { User } from '../model/interfaces';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    const jwt = (this.isRefreshTokenCall(req)) ? this.userService.getRefreshToken : this.userService.getJwtToken;
    const request = this.setToken(req, jwt);

    return next.handle(request)
      .pipe(catchError(error => {
        if (error.status === 403 && !request.url.includes("/login")) {
          return this.refreshToken(request, next);
        }
        return throwError(error);
      }));
  }

  private setToken(request: HttpRequest<any>, jwt: string) {
    if (jwt !== null) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      });
    } else return request;
  }

  private isRefreshTokenCall(req: HttpRequest<any>) {
    return req.url.includes('/token/refresh');
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler) {
    return this.userService.refreshUserToken()
      .pipe(switchMap(jwt => {
        return next.handle(this.setToken(request, jwt as string));
      }));
  }
}
