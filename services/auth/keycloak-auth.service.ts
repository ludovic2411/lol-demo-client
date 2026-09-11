import { Injectable } from '@angular/core';
import {IAuthService} from './IAuthService';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Implements authentication using keycloak
 */
@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService implements IAuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private oauthService: OAuthService) {
    this.setupOAuth2();
    this.checkIfAlreadyLoggedIn();
  }

  /**
   * Configure OAuth2/OIDC with Keycloak parameters
   */
  private setupOAuth2(): void {
    const REALM_BASE_URL = 'http://localhost:9090/realms/lol-demo-server-realm';
    const REDIRECT_BASE_URI = `${window.location.origin}/login/callback`;
    const CLIENT_ID = 'lol-demo-server-client';
    const LOGOUT_BASE_URL = `${REALM_BASE_URL}/protocol/openid-connect/logout`;
    const POST_LOGOUT_URI = `${window.location.origin}/logout/success`;
    this.oauthService.configure({
      //url to locate keycloak login portal
      loginUrl: `${REALM_BASE_URL}/protocol/openid-connect/auth`,
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_BASE_URI,
      //  logout
      postLogoutRedirectUri: POST_LOGOUT_URI,
      // Keycloak issuer
      issuer: REALM_BASE_URL,
      // Scopes
      scope: 'openid profile email',
      // Flow recommandé pour SPA
      responseType: 'code',
      // PKCE for better security(SPA)
      //usePkceWithAuthorizationCodeFlow: true, => keep it for angular-oidc 22
      disablePKCE: false,
      //Url to redirect for logging out
      //http://localhost:9090/realms/lol-demo-server-realm/protocol/openid-connect/logout?id_token_hint=
      logoutUrl: `${REALM_BASE_URL}/protocol/openid-connect/logout`,
      //  tokens management
      requireHttps: false, //  true prod
      showDebugInformation: true //  false prod
    });

    // Listen authentification events
    this.oauthService.events.subscribe((event: OAuthEvent) => {
      if (event instanceof OAuthSuccessEvent) {
        if (event.type === 'token_received') {
          console.log('Token received !');
          this.updateAuthStatus();
        }
      }
    });
  }

  /**
   * Check whether user is already logged in at app start page
   */
  private checkIfAlreadyLoggedIn(): void {
    // Essaie de charger les tokens depuis le storage
    if (this.hasValidToken()) {
      this.updateAuthStatus();
    }
  }

  /**
   * Check if a valid token exists
   */
  private hasValidToken(): boolean {
    return !!this.oauthService.getAccessToken();
  }

  /**
   * Update authentication state
   */
  private updateAuthStatus(): void {
    const isLoggedIn = this.oauthService.hasValidAccessToken();
    this.isAuthenticatedSubject.next(isLoggedIn);

    if (isLoggedIn) {
      const claims = this.oauthService.getIdentityClaims() as any;
      this.currentUserSubject.next({
        username: claims?.preferred_username || claims?.sub,
        email: claims?.email,
        roles: this.getUserRoles()
      });
    } else {
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Starts login OAuth2 (redirection to Keycloak)
   */
  login(): void {
    // InitAuthorization Code flow with PKCE
    this.oauthService.initCodeFlow();
  }

  /**
   * Traite le callback après authentification (appelé après redirection de Keycloak)
   * À appeler dans un composant avec une route /login/callback
   * Handle callback after authentication (after keycloak redirection)
   * Need to call it in a component with /login/callback route
   */
  handleLoginCallback(): Promise<void> {
    return this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.updateAuthStatus();
      console.log('Login callback handled, token acquired');
    }).catch(err => {
      console.error('Error encountered while handling callback login', err);
    });
  }

  /**
   * Logout and token suppression for angular-oidc 19
   */
  logout(): void {
    // revokeTokenAndLogout envoie id_token_hint automatiquement
    // et redirige vers postLogoutRedirectUri après déconnexion Keycloak
    this.oauthService.logOut();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Logout and token suppression TODO use it with angular/angular-oidc v22

  logout(): void {
    this.oauthService.revokeTokenAndLogout();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }
    */

  /**
   * Get current JWT
   */
  getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  /**
   * Get user roles from JWT
   * Keycloak put them in : resource_access.<client-id>.roles
   */
  getUserRoles(): string[] {
    const claims = this.oauthService.getIdentityClaims() as any;
    const resourceAccess = claims?.resource_access;

    if (!resourceAccess) {
      return [];
    }

    const clientRoles = resourceAccess['lol-demo-server-client']?.roles || [];
    return clientRoles;
  }

  /**
   * Check if user has a given role
   */
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * Get current identity (claims from JWT)
   */
  getUserInfo(): any {
    return this.oauthService.getIdentityClaims();
  }

  /**
   * Check wether user is identifed
   */
  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
