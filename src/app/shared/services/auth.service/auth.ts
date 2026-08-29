import { computed, Injectable, signal } from '@angular/core';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'shopSphereUser';
  private readonly currentUserSignal = signal<AuthUser | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  private getStoredUser(): AuthUser | null {
    const storedUser = sessionStorage.getItem(this.storageKey);
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }

  login(email: string, password: string): boolean {
    let user: AuthUser | null = null;
    if (email === 'user@example.com' && password === 'password123') {
      user = {
        id: 1,
        name: 'Rishabh Kumar',
        email,
        role: 'user',
      };
    }

    if (email === 'admin@ec.com' && password === 'admin@123') {
      user = {
        id: 2,
        name: 'Admin User',
        email,
        role: 'admin',
      };
    }

    if (!user) {
      return false;
    }

    this.currentUserSignal.set(user);
    sessionStorage.setItem(this.storageKey, JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem(this.storageKey);
  }
}
