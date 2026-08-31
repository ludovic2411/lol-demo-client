import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {LinkItemComponent} from '../components/link-item/link-item.component';
import {AppServiceService} from '../../services/app/app-service.service';
import {LoginPageComponent} from '../components/pages/login-page/login-page.component';
import {ChampionsPageComponent} from '../components/pages/champions-page/champions-page.component';
import {MyProfilePageComponent} from '../components/pages/my-profile-page/my-profile-page.component';
import {JwtAuthService} from '../../services/auth/jwt-auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LinkItemComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  private appService: AppServiceService = inject(AppServiceService)
  private authService: JwtAuthService = inject(JwtAuthService);
  #router: Router = inject(Router);
  title: String = 'my-little-angular-app';
  isBeginner: boolean = false;
  searchOptions: any = {};

  toggleBeginner(): void {
  this.isBeginner =  this.appService.toggleBeginner(this.isBeginner)
  }

  async logout(): Promise<void> {
    if(sessionStorage.getItem('token') || localStorage.getItem('token')) {
      this.authService.logout().subscribe(
        {
          next: this.handleLogout,
          error: this.handleLogoutError
        }
      );
    }
  }

   handleLogout = (res: any): void => {
      console.log('logout succesful: removing token from session storage');
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      this.#router.navigate(['login']);
  }

  handleLogoutError = (e: any):void => console.error(`Problem while logging out: ${e}`);

  isNavigationEnabled(): boolean {
    return this.#router.url.endsWith('login') || this.#router.url.endsWith('signup');
}
}
