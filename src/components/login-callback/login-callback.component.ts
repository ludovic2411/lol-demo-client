import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakAuthService} from '../../../services/auth/keycloak-auth.service';

/**
 * Composant de callback après redirection de Keycloak
 * Route : /login/callback
 *
 * Keycloak redirige ici avec le code d'autorisation en paramètre d'URL
 * Ce composant échange le code contre un token JWT
 */
@Component({
  selector: 'app-login-callback',
  standalone: true,
  template: `
    <div class="login-callback-container">
      <div class="loading">
        <p>Authentification in progress...</p>
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .login-callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .loading {
      text-align: center;
      color: white;
    }

    .loading p {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoginCallbackComponent implements OnInit {

  constructor(
    private authService: KeycloakAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // handle callback OAuth2 (exchange code with token)
    this.authService.handleLoginCallback().then(() => {
      console.log('Authentification réussie, redirection vers dashboard...');
      // Redirect to dashboard if authentication is succesful
      this.router.navigate(['/dashboard']);
    }).catch(err => {
      console.error('Erreur lors de l\'authentification', err);
      // Redirect to login if unsuccessful
      this.router.navigate(['/login']);
    });
  }
}
