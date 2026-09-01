import {HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {KeycloakAuthService} from '../services/auth/keycloak-auth.service';
import {inject} from '@angular/core';

export function keyCloakAuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // Get auth token
  const keyCloakAuthService: KeycloakAuthService = inject(KeycloakAuthService);
  const token = keyCloakAuthService.getAccessToken();

  // If token exists au header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
}
