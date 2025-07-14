import { Injectable } from '@angular/core';
import { ADMIN_CREDENTIALS } from '../mock/admin-login-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  login(username: string, password: string): boolean {
    const found = ADMIN_CREDENTIALS.some(
      cred => cred.username === username && cred.password === password
    );
    console.log('[AuthService] Login attempt:', { username, password, found, ADMIN_CREDENTIALS });
    return found;
  }
}
