import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { keyCloakAuthGuardGuard } from './key-cloak-auth-guard.guard';

describe('keyCloakAuthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => keyCloakAuthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
