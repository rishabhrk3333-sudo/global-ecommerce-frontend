import {
  Injectable,
  signal
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  readonly isDarkMode = signal(false);


  constructor() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add(
        'dark-theme'
      );

    }

  }


  toggleTheme(): void {
    const isDark =
    !this.isDarkMode();
    this.isDarkMode.set(isDark);
    document.body.classList.toggle(
      'dark-theme',
      isDark
    );

    localStorage.setItem(
      'theme',
      isDark ? 'dark' : 'light'
    );

  }

}