import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import {KeycloakAuthService} from '../services/auth/keycloak-auth.service';

/**
 * Route Guard - Protect routes
 */
@Injectable({
  providedIn: 'root'
})
export class KeyCloakAuthGuard {
  constructor(private authService: KeycloakAuthService, private router: Router) { }

  canActivate: CanActivateFn = (route, state) => {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Redirect to login if not connected
    console.warn('Accès refusé, redirection vers login');
    this.router.navigate(['/login']);
    return false;
  };
}

export const keyCloakAuthGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
