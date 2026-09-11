import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {loggingRequestStatusInterceptor} from '../../interceptors/requestFetchingInterceptors';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration} from '@angular/common/http';
import {keyCloakAuthInterceptor} from '../../interceptors/KeyCloakAuthInterceptor';
import {OAuthModule} from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withComponentInputBinding()),
    provideHttpClient(withFetch(),withInterceptors(
      [
        keyCloakAuthInterceptor,
        loggingRequestStatusInterceptor]
    ),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })),
    // OAuth2 OIDC Module (angular-oauth2-oidc)
    importProvidersFrom(OAuthModule.forRoot())
  ]
};
