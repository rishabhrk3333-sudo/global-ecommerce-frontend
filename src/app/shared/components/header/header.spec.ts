import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Header } from './header';
import { CartService } from '../../services/cart.service/cart-service';
import { AuthService } from '../../services/auth.service/auth';
import { ThemeService } from '../../services/theme.service/theme';

describe.only('Header', () => {
  let component: Header;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        {
          provide: CartService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: null,
            isLoggedIn: false,
            logout: vi.fn(),
          },
        },
        {
          provide: ThemeService,
          useValue: {},
        },
      ],
    });

    const fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle navigation menu', () => {
    expect(component.isNavOpen()).toBe(false);

    component.toggleNav();

    expect(component.isNavOpen()).toBe(true);

    component.toggleNav();

    expect(component.isNavOpen()).toBe(false);
  });

  it('should toggle user menu', () => {
    expect(component.isMenuOpen()).toBe(false);

    component.toggleMenu();

    expect(component.isMenuOpen()).toBe(true);

    component.toggleMenu();

    expect(component.isMenuOpen()).toBe(false);
  });

  it('should logout and navigate to login', () => {
    const logoutSpy = vi.spyOn(authService, 'logout');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onLogout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(component.isMenuOpen()).toBe(false);
  });
});
