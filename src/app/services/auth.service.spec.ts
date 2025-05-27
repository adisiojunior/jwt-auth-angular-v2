import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate with any user (fake)', (done) => {
    service.login('admin', '123').subscribe(res => {
      expect(res.accessToken).toBeTruthy();
      done();
    });
  });

  it('should return isAuthenticated true after login', (done) => {
    service.login('admin', '123').subscribe(() => {
      expect(service.isAuthenticated()).toBeTrue();
      done();
    });
  });

  it('should logout and isAuthenticated should be false', () => {
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
  });
}); 