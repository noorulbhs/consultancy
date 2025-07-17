

import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { ADMIN_API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpService: HttpService) {}

  login(username: string, password: string): Observable<boolean> {
    return this.httpService.post<any>(ADMIN_API_ENDPOINTS.LOGIN, { username, password }, { isPublic: false })
      .pipe(
        map(res => {
          if (res && res.data && res.data.token) {
            localStorage.setItem('authToken', res.data.token);
            return true;
          }
          return false;
        }),
        catchError(err => {
          console.error('[AuthService] Login error:', err);
          return of(false);
        })
      );
  }
}
