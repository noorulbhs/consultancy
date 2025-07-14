import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { buildApiUrl, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private careersUrl = ADMIN_API_ENDPOINTS.CAREERS;

  constructor(
    private http: HttpService,
    private activityTracker: ActivityTrackerService
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(this.careersUrl).pipe(
      map(res => {
        if (res.data && Array.isArray(res.data.content)) return res.data.content;
        return [];
      })
    );
  }

  getById(id: number): Observable<any> {
    const endpoint = ADMIN_API_ENDPOINTS.CAREER_BY_ID(id);
    return this.http.get<any>(endpoint).pipe(
      map(res => res.data!)
    );
  }

  add(job: any): Observable<any> {
    this.activityTracker.trackJobActivity('Created', job.title || 'New Job Position', 'Admin');
    return this.http.post<any>(this.careersUrl, job).pipe(
      map(res => res.data!)
    );
  }

  update(id: number, updated: any): Observable<any> {
    this.activityTracker.trackJobActivity('Updated', updated.title || 'Job Position', 'Admin');
    const endpoint = ADMIN_API_ENDPOINTS.CAREER_BY_ID(id);
    return this.http.put<any>(endpoint, updated).pipe(
      map(res => res.data!)
    );
  }

  delete(id: number): Observable<any> {
    this.activityTracker.trackJobActivity('Deleted', 'Job Position', 'Admin');
    const endpoint = ADMIN_API_ENDPOINTS.CAREER_BY_ID(id);
    return this.http.delete<any>(endpoint).pipe(
      map(res => res.data!)
    );
  }

  toggleStatus(id: number): Observable<any> {
    // Example: PATCH to /admin/careers/:id/toggle-status
    const endpoint = `${this.careersUrl}/${id}/toggle-status`;
    return this.http.patch<any>(endpoint, {}).pipe(
      map(res => res.data!)
    );
  }

}
