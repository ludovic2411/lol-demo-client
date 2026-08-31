import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {authService} from '../backend/login/auth.service';
import {LoginRequest} from '../../models/backend/login/LoginRequest';
import {LoginResponse} from '../../models/backend/login/LoginResponse';
import {Observable} from 'rxjs';
import {IAuthService} from './IAuthService';

/**
 * Implements authentication with basic jwt token
 */
@Injectable({
  providedIn: 'root'
})
export class JwtAuthService implements IAuthService {

  private loginService: authService;

  constructor(loginService: authService) {
    this.loginService = loginService;
  }

 createTokenFromLogin(payload: LoginRequest):Observable<LoginResponse | null> {
  return this.loginService.login(payload);
}

logout(): Observable<number | null> {
return this.loginService.logout();
}

getTokenFromStorage(): LoginResponse | null {
    let token: LoginResponse | null = null;
  console.log('Looking credentials for token from SessionStorage first');
    if( sessionStorage.getItem('token') !== null  && sessionStorage.getItem('token')) {
      token = JSON.parse(<string>sessionStorage.getItem('token'));
    } else  if (localStorage.getItem('token') !== null && localStorage.getItem('token') ) {
      token = JSON.parse(<string>localStorage.getItem('token'));
    }
    return token;
}

  getBasicCredentialsFromStorage(): string | null{
    let username: string;
    let password: string;
    console.log('Looking credentials for basic auth from SessionStorage first');

    if(sessionStorage.getItem('username') && sessionStorage.getItem('password')) {

      username = <string>sessionStorage.getItem('username');
      password = <string>sessionStorage.getItem('password');
      return username + ':' + password;
    } else if(localStorage.getItem('username') && localStorage.getItem('password')) {

      console.log('No credentials found in session storage, looking in local storage');

      username = <string>localStorage.getItem('username');
      password = <string>localStorage.getItem('password');
      return username + ':' + password;
    } else {
      console.error('No credentials found. cannot authenticate');
      return null;
    }
  }
}
