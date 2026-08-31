import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly storageKey = 'shopSphereUser';
  private readonly usersUrl = 'assets/data/users.json';

  private readonly currentUserSignal = signal<User | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  private getStoredUser(): User | null {
    const storedUser = sessionStorage.getItem(this.storageKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map((users) => {
        const user = users.find((user) => user.email === email && user.password === password);

        if (!user) {
          return false;
        }

        const authUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password,
        };

        this.currentUserSignal.set(authUser);

        sessionStorage.setItem(this.storageKey, JSON.stringify(authUser));

        return true;
      }),
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem(this.storageKey);
  }
}
