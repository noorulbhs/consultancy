import { Injectable } from '@angular/core';
import { ADMIN_CREDENTIALS } from '../mock/admin-credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly key = 'admin_logged_in';

  login(username: string, password: string): boolean {
    const found = ADMIN_CREDENTIALS.some(
        cred => cred.username === username && cred.password === password
      );
    if (found) {
      localStorage.setItem(this.key, 'true');
      return true;
    }
    return false;
  }

  // login(username: string, password: string): boolean {
  //     const found = ADMIN_CREDENTIALS.some(
  //       cred => cred.username === username && cred.password === password
  //     );
  //     console.log('[AuthService] Login attempt:', { username, password, found, ADMIN_CREDENTIALS });
  //     return found;
  //   }

  logout(): void {
    localStorage.removeItem(this.key);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.key) === 'true';
  }
}
