import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ADMIN_API_ENDPOINTS, PUBLIC_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  constructor(private httpService: HttpService) {}

  getAll(): Observable<any[]> {
    return this.httpService.get<any[]>(ADMIN_API_ENDPOINTS.SERVICES)
      .pipe(
        map(res => Array.isArray(res.data) ? res.data : [])
      );
  }

  getAllPublic(): Observable<any[]> {
    return this.httpService.get<any[]>(PUBLIC_API_ENDPOINTS.SERVICES)
      .pipe(
        map(res => Array.isArray(res.data) ? res.data : [])
      );
  }

  getById(id: number): Observable<any> {
    return this.httpService.get<any>(ADMIN_API_ENDPOINTS.SERVICE_BY_ID(id)).pipe(
      map(res => res.data)
    );
  }

  add(service: any): Observable<any> {
    return this.httpService.post<any>(ADMIN_API_ENDPOINTS.SERVICES, service);
  }

  update(id: number, updated: any): Observable<any> {
    return this.httpService.put<any>(ADMIN_API_ENDPOINTS.SERVICE_BY_ID(id), updated);
  }

  delete(id: number): Observable<any> {
    return this.httpService.delete<any>(ADMIN_API_ENDPOINTS.SERVICE_BY_ID(id));
  }
}
