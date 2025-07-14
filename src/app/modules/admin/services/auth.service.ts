import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, ADMIN_API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = buildApiUrl(ADMIN_API_ENDPOINTS.LOGIN);

  constructor(private http: HttpClient) {}

  /**
   * Login with real backend. Returns Observable of API response.
   * @param email admin email
   * @param password admin password
   */
  login(email: string, password: string): Observable<any> {
    console.log('AuthService loginUrl:', this.loginUrl);
    return this.http.post<any>(this.loginUrl, { email, password });
  }
}
