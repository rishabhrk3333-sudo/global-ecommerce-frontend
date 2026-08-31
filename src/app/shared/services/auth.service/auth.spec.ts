import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe.only('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  const mockUsers = [
    {
      id: 1,
      name: 'Rishabh Kumar',
      email: 'user@ec.com',
      password: 'Reset@123',
      role: 'user' as const,
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@ec.com',
      password: 'Reset@123',
      role: 'admin' as const,
    },
  ];

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid credentials', () => {
    service.login('user@ec.com', 'Reset@123').subscribe((success) => {
      expect(success).toBe(true);
      expect(service.currentUser()?.email).toBe('user@ec.com');
      expect(service.currentUser()?.role).toBe('user');
      expect(service.isLoggedIn()).toBe(true);
    });

    const request = httpTestingController.expectOne('assets/data/users.json');

    expect(request.request.method).toBe('GET');

    request.flush(mockUsers);
  });

  it('should return false for invalid credentials', () => {
    service.login('wrong@ec.com', 'wrong-password').subscribe((success) => {
      expect(success).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
    });

    const request = httpTestingController.expectOne('assets/data/users.json');

    request.flush(mockUsers);
  });

  it('should logout the user', () => {
    service.login('user@ec.com', 'Reset@123').subscribe(() => {
      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
      expect(sessionStorage.getItem('shopSphereUser')).toBeNull();
    });

    const request = httpTestingController.expectOne('assets/data/users.json');

    request.flush(mockUsers);
  });
});
