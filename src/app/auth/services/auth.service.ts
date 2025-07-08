import { Injectable } from '@angular/core';
import { ADMIN_CREDENTIALS } from '../mock/admin-credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly key = 'admin_logged_in';

  login(username: string, password: string): boolean {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem(this.key, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.key);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.key) === 'true';
  }
}
