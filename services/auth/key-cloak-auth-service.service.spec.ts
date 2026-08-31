import { TestBed } from '@angular/core/testing';

import { KeyCloakAuthService } from './key-cloak-auth.service';

describe('KeyCloakAuthServiceService', () => {
  let service: KeyCloakAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyCloakAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
