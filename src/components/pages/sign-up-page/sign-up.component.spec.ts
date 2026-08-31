import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignUpComponent} from './sign-up.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SignupService} from '../../../../services/backend/signup/signup.service';
import {authService} from '../../../../services/backend/login/auth.service';
import {Router} from '@angular/router';
import {SignupResponse} from '../../../../models/backend/signup/SignupResponse';
import {SignupRequest} from '../../../../models/backend/signup/SignupRequest';
import {of} from 'rxjs';
import {JwtAuthService} from '../../../../services/auth/jwt-auth.service';
import {LoginResponse} from '../../../../models/backend/login/LoginResponse';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let signupServiceSpy: jasmine.SpyObj<SignupService>
  let authServiceSpy: jasmine.SpyObj<JwtAuthService>
  let router: Router;

  beforeEach(async () => {
    const signupSpy = jasmine.createSpyObj('SignupService', ['signup']);
    const loginSpy = jasmine.createSpyObj('LoginService', ['createTokenFromLogin']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [SignUpComponent, HttpClientTestingModule],
      providers: [
        {provide: SignupService, useValue: signupSpy},
        {provide: JwtAuthService, useValue: loginSpy},
        {provide: Router, useValue: routerSpy}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    signupServiceSpy = TestBed.inject(SignupService) as jasmine.SpyObj<SignupService>;
    authServiceSpy = TestBed.inject(JwtAuthService) as jasmine.SpyObj<JwtAuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update and validate data', () => {
    component.onUsernameUpdate('chouii');
    component.onPasswordUpdate('chuii78');
    component.onRegionUpdate('EUW');
    component.onEmailChange('choui@chuipi.com');

    expect(component.region.valid).toBeTrue();
    expect(component.userName.valid).toBeTrue();
    expect(component.password.valid).toBeTrue();
    expect(component.email.valid).toBeTrue();
  });

  it('should update and have non valide data', () => {
    component.onUsernameUpdate('ch');
    component.onPasswordUpdate('    ');
    component.onEmailChange('chouichuipi');

    expect(component.userName.valid).toBeFalse();
    expect(component.password.valid).toBeFalse();
    expect(component.email.valid).toBeFalse();
  });

  it('should create a valid login', async () => {
    component.onUsernameUpdate('chouii');
    component.onPasswordUpdate('chuii78');
    component.onRegionUpdate('EUW');
    component.onEmailChange('choui@chuipi.com');

    const mockResponse: SignupResponse = {
      username: 'chouii',
      email: 'choui@chuipi.com',
      region: 'EUW',
      enabled: true,
      expirationDate: '',
      creationdate: new Date().toString(),
      accountNonExpired: true,
      credentialsNonExpired: true,
      accountNonLocked: true
    }

    const mockToken: LoginResponse = {token: 'myLovelyToken'};

    signupServiceSpy.signup.and.returnValue(of(mockResponse));
    authServiceSpy.createTokenFromLogin.and.returnValue(of(mockToken));
    await component.signup().then((res) => {
      expect(sessionStorage.getItem('token')).toBeDefined();
      expect(sessionStorage.getItem('token')).toEqual(JSON.stringify(mockToken));
      expect(router.navigate).toHaveBeenCalledWith(['my-profile']);
      expect(component.wrongLogin).toBeFalse();
      sessionStorage.removeItem('token');
    })
  });


  it('should not create a login if signup fails',async () => {
    signupServiceSpy.signup.and.returnValue(of(null));
    await component.signup().then((res) => {
      expect(sessionStorage.getItem('token')).toBeNull();
    });
  });

  it('should not create a login if login fails',async () => {
    component.onUsernameUpdate('chouii');
    component.onPasswordUpdate('chuii78');
    component.onRegionUpdate('EUW');
    component.onEmailChange('choui@chuipi.com');

    const mockResponse: SignupResponse = {
      username: 'chouii',
      email: 'choui@chuipi.com',
      region: 'EUW',
      enabled: true,
      expirationDate: '',
      creationdate: new Date().toString(),
      accountNonExpired: true,
      credentialsNonExpired: true,
      accountNonLocked: true
    }

    signupServiceSpy.signup.and.returnValue(of(mockResponse));
    authServiceSpy.createTokenFromLogin.and.throwError('login error !');
    await component.signup().then((res) => {
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(component.wrongLogin).toBeTrue();
    })
  });


});
