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
    const REDIRECT_BASE_URI = window.location.origin + '/login/callback';
    const CLIENT_ID = 'lol-demo-server-client';
    this.oauthService.configure({
      loginUrl: `${REALM_BASE_URL}/protocol/openid-connect/auth`,
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_BASE_URI,
      //  logout
      postLogoutRedirectUri: window.location.origin + '/',
      // Keycloak issuer
      issuer: REALM_BASE_URL,
      // Scopes
      scope: 'openid profile email',
      // Flow recommandé pour SPA
      responseType: 'code',
      // PKCE for better security(SPA)
      //usePkceWithAuthorizationCodeFlow: true, => keep it for angular-oidc 22
      disablePKCE: false,
      // Log in console (optionnel, pour debug)
      logoutUrl: 'http://localhost:9090/realms/lol-demo-server-realm/protocol/openid-connect/logout',
      //  tokens management
      requireHttps: false, //  true prod
      showDebugInformation: true //  false prod
    });

    // Listen authentification events
    this.oauthService.events.subscribe((event: OAuthEvent) => {
      if (event instanceof OAuthSuccessEvent) {
        if (event.type === 'token_received') {
          console.log('Token reçu !');
          this.updateAuthStatus();
        }
      }
    });
  }

  /**
   * Vérifie si l'utilisateur est déjà connecté (au chargement de l'app)
   */
  private checkIfAlreadyLoggedIn(): void {
    // Essaie de charger les tokens depuis le storage
    if (this.hasValidToken()) {
      this.updateAuthStatus();
    }
  }

  /**
   * Vérifie s'il existe un token valide
   */
  private hasValidToken(): boolean {
    return !!this.oauthService.getAccessToken();
  }

  /**
   * Met à jour l'état d'authentification
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
   * Lance le flow de login OAuth2 (redirection vers Keycloak)
   */
  login(): void {
    // Initie le flow Authorization Code avec PKCE
    this.oauthService.initCodeFlow();
  }

  /**
   * Traite le callback après authentification (appelé après redirection de Keycloak)
   * À appeler dans un composant avec une route /login/callback
   */
  handleLoginCallback(): Promise<void> {
    return this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.updateAuthStatus();
      console.log('Login callback traité, token acquis');
    }).catch(err => {
      console.error('Erreur lors du callback login', err);
    });
  }

  /**
   * Logout et suppression du token
   */
  logout(): void {
    this.oauthService.revokeTokenAndLogout();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Récupère le token JWT courant
   */
  getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  /**
   * Récupère les rôles de l'utilisateur depuis le JWT
   * Keycloak les place dans : resource_access.<client-id>.roles
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
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * Récupère l'identité actuelle (claims du JWT)
   */
  getUserInfo(): any {
    return this.oauthService.getIdentityClaims();
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
