import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { buildApiUrl, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private servicesUrl = ADMIN_API_ENDPOINTS.SERVICES;

  constructor(
    private http: HttpService,
    private activityTracker: ActivityTrackerService
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(this.servicesUrl).pipe(
      map(res => {
        if (res.data && Array.isArray(res.data.content)) return res.data.content;
        return [];
      })
    );
  }

  getById(id: number): Observable<any> {
    const endpoint = ADMIN_API_ENDPOINTS.SERVICE_BY_ID(id);
    return this.http.get<any>(endpoint).pipe(
      map(res => res.data!)
    );
  }

  add(service: any): Observable<any> {
    this.activityTracker.trackServiceActivity('Created', service.title || 'New Service', 'Admin');
    return this.http.post<any>(this.servicesUrl, service).pipe(
      map(res => res.data!)
    );
  }

  update(id: number, updated: any): Observable<any> {
    this.activityTracker.trackServiceActivity('Updated', updated.title || 'Service', 'Admin');
    const endpoint = ADMIN_API_ENDPOINTS.SERVICE_BY_ID(id);
    return this.http.put<any>(endpoint, updated).pipe(
      map(res => res.data!)
    );
  }

  delete(id: number): Observable<any> {
    this.activityTracker.trackServiceActivity('Deleted', 'Service', 'Admin');
    const endpoint = ADMIN_API_ENDPOINTS.SERVICE_BY_ID(id);
    return this.http.delete<any>(endpoint).pipe(
      map(res => res.data!)
    );
  }
}
