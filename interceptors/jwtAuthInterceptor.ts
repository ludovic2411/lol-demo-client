import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {JwtAuthService} from '../services/auth/jwt-auth.service';
import {Observable, throwError} from 'rxjs';
import {LoginResponse} from '../models/backend/login/LoginResponse';

const urlsToTest: string[] = ['/login', '/user/create', '/reset/token'];
const ignorePostRequests = (req: HttpRequest<unknown>): boolean => { return req.method === 'POST' && urlsToTest.some(url => req.url.endsWith(url))}
const ignorePatchRequets = (req: HttpRequest<unknown>): boolean => { return req.method === 'PATCH' && req.url.endsWith(urlsToTest[2])}

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // Don't add token if we login for the first time
  if((ignorePostRequests(req) || ignorePatchRequets(req)) && !sessionStorage.getItem('token')) {
    return next(req);
  } else {
    console.log(`Adding authorization credentials before request to: ${req.method} ${req.url}`);

    const token: LoginResponse | null = inject(JwtAuthService).getTokenFromStorage();
    if (token === null) throwError(() => new Error('Authorization credentials not found'));
    const newReq = req.clone({
      headers: req.headers
        .append('Authorization', 'Bearer ' + token?.token)
        .append('Content-Type', 'application/json')
      // headers: req.headers.append('X-Authentication-Token', authToken),
    });
    return next(newReq);
  }
}
