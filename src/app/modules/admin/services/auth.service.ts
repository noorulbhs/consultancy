import { Injectable } from '@angular/core';
import { ADMIN_CREDENTIALS } from '../mock/admin-login-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  login(username: string, password: string): boolean {
    return (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    );
  }
}
