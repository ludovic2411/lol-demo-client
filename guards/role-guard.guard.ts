import {CanActivateFn, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {KeycloakAuthService} from '../services/auth/keycloak-auth.service';

@Injectable({
  providedIn: 'root'
})
export class KeyCloakAuthGuard {
  constructor(private authService: KeycloakAuthService, private router: Router) { }

  canActivate: CanActivateFn = (route, state) => {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get roles from route data
    const requiredRoles: string[] = route.data['roles'] || [];

    if (requiredRoles.length === 0) {
      return true;
    }

    // Check if the user has at least one required role
    const hasRequiredRole = requiredRoles.some(role =>
      this.authService.hasRole(role)
    );

    if (!hasRequiredRole) {
      console.warn(`Access denied, required roles: ${requiredRoles.join(', ')}`);
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  };
}
