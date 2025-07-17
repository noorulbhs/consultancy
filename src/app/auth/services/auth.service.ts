
import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { ADMIN_API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';

  constructor(private httpService: HttpService) {}

  login(username: string, password: string): Observable<boolean> {
    return this.httpService.post<any>(
      ADMIN_API_ENDPOINTS.LOGIN,
      { email: username, password },
      { isPublic: false }
    ).pipe(
      map((response: any) => {
        if (response && response.data && response.data.token) {
          localStorage.setItem(this.TOKEN_KEY, response.data.token);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
