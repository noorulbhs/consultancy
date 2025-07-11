import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  public isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor() {
    // Don't apply any theme by default - let components handle their own themes
  }

  setDarkTheme(): void {
    this.isDarkThemeSubject.next(true);
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }

  setLightTheme(): void {
    this.isDarkThemeSubject.next(false);
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  }

  toggleTheme(): void {
    const currentTheme = this.isDarkThemeSubject.value;
    if (currentTheme) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  isDarkTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }
}
