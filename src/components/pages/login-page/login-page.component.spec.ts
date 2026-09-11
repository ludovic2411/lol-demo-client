import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {provideRouter, Router} from '@angular/router';
import {JwtAuthService} from '../../../../services/auth/jwt-auth.service';
import Jasmine = jasmine.Jasmine;
import {LoginResponse} from '../../../../models/backend/login/LoginResponse';
import {of, throwError} from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<JwtAuthService>;
  let token: LoginResponse = {
    token: 'myLittleToken'
  }

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const spy = jasmine.createSpyObj('AuthService', ['createTokenFromLogin']);
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent,  HttpClientTestingModule],
      providers
        : [
        { provide: JwtAuthService, useValue: spy},
        { provide: Router, useValue: routerSpy },
        provideRouter([])
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(JwtAuthService) as jasmine.SpyObj<JwtAuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test password setting', () => {
    component.onPasswordUpdate(' tutu ');
    expect(component.password.getRawValue()).toEqual('tutu');
    expect(component.password.valid).toBeTrue();
  });

  it('test username setting', () => {
    component.onUserNameUpdate(' toto ');
    expect(component.userName.getRawValue()).toEqual('toto');
    expect(component.userName.valid).toBeTrue();
  });


  it('should navigate to signup', () => {
    component.goToSignup();
    expect(router.navigate).toHaveBeenCalledWith(['signup']);
  });

  it('should navigate to reset password page', () => {
    component.goToResetPassword();
    expect(router.navigate).toHaveBeenCalledWith(['reset/ask']);
  });


  it('should store token and navigate to my-profile on successful login', async () => {
    // Arrange
    component.userName.setValue('validUser');
    component.password.setValue('validPwd');
    authServiceSpy.createTokenFromLogin.and.returnValue(of(token));

    // Act
    await component.login().then((result) => {
      // Assert
      expect(sessionStorage.getItem('token')).toEqual(JSON.stringify(token));
      expect(router.navigate).toHaveBeenCalledWith(['my-profile']);
      expect(component.wrongLogin).toBeFalse();
      sessionStorage.removeItem('token');
    });

  });


  it('should set wrongLogin to true on null login ', async () => {
    // Arrange
    fixture.detectChanges();
    component.userName.setValue('validUser');
    component.password.setValue('validPwd');
    authServiceSpy.createTokenFromLogin.and.returnValue(of(null));

    // Act
    await component.login().then((result) => {
      // Assert
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.wrongLogin).toBeTrue();
      const wrongLoginText: HTMLElement = fixture.nativeElement.querySelector('#wrong-login-message');
      expect(wrongLoginText).toBeDefined();
    });
  });

  it('should set wrongLogin to true on error from login service ', async () => {
    // Arrange
    fixture.detectChanges();
    component.userName.setValue('validUser');
    component.password.setValue('validPwd');
    authServiceSpy.createTokenFromLogin.and.throwError('error');

    // Act
    await component.login().then((result) => {
      // Assert
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.wrongLogin).toBeTrue();
    });
  });

  it('should set wrongLogin to true on empty object from login service ', async () => {
    // Arrange
    fixture.detectChanges();
    component.userName.setValue('validUser');
    component.password.setValue('validPwd');
    authServiceSpy.createTokenFromLogin.and.returnValue(of({token:''}));

    // Act
    await component.login().then((result) => {
      // Assert
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.wrongLogin).toBeTrue();
    });
  });


});
