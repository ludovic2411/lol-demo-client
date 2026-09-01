import {Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {JwtAuthService} from '../../../../services/auth/jwt-auth.service';
import {LoginRequest} from '../../../../models/backend/login/LoginRequest';
import {Router} from '@angular/router';
import {TextInputComponent} from '../../text-input/text-input.component';
import {StandardButtonComponent} from '../../standard-button/standard-button.component';
import {firstValueFrom} from 'rxjs';
import {LoginResponse} from '../../../../models/backend/login/LoginResponse';
import {KeycloakAuthService} from '../../../../services/auth/keycloak-auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    StandardButtonComponent,
    TextInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  authService: JwtAuthService = inject(JwtAuthService);
  keycloakAuthService: KeycloakAuthService = inject(KeycloakAuthService);
  #router = inject(Router);

  pageTitle: string = 'Login';
  userNameLabel: string = 'Username';
  passwordlabel: string = 'Password';
  wrongLogin: boolean = false;

  userName: FormControl<string | null> = new FormControl('', [
    Validators.required, Validators.minLength(4), Validators.maxLength(50)
  ]);
  password: FormControl<string | null> = new FormControl('', [
    Validators.required, Validators.minLength(4), Validators.maxLength(12)
  ]);

  onUserNameUpdate(value: string) {
    this.userName.setValue(value.trim());
  }

  onPasswordUpdate(value: string) {
    this.password.setValue(value.trim());
  }

  goToSignup(): void {
    this.#router.navigate(['signup']);
  }

  goToResetPassword(): void {
    this.#router.navigate(['reset/ask']);
  }

  loginWithKeycloak(): void {
    console.log('Starting login OAuth2...');
    this.keycloakAuthService.login();
  }

  async login(): Promise<void> {
    if (this.userName.value !== null && this.password.value !== null && this.userName.valid && this.password.valid) {

      const payload: LoginRequest = {
        userName: this.userName.value,
        password: this.password.value
      }

      try {
        const res: LoginResponse | null = await firstValueFrom(this.authService.createTokenFromLogin(payload));
        if (res !== null && res.token) {
          this.wrongLogin = false;
          sessionStorage.setItem('token', JSON.stringify(res));
          this.#router.navigate(['my-profile']);
        } else {
          console.error('No token has been provided by the server')
          this.wrongLogin = true;
        }
      } catch (e) {
        console.error(e);
        this.wrongLogin = true;
      }
    }
  }
}
