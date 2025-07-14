import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { buildApiUrl, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private enquiriesUrl = ADMIN_API_ENDPOINTS.ENQUIRIES;

  constructor(
    private http: HttpService,
    private activityTracker: ActivityTrackerService
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(this.enquiriesUrl).pipe(
      map(res => {
        if (res.data && Array.isArray(res.data.enquiries)) return res.data.enquiries;
        return [];
      })
    );
  }

  add(enquiry: any): Observable<any> {
    this.activityTracker.trackEnquiryActivity('Received', `New enquiry from ${enquiry.name || 'Unknown'}: ${enquiry.subject || 'No subject'}`, 'System');
    return this.http.post<any>(this.enquiriesUrl, enquiry).pipe(
      map(res => res.data!)
    );
  }

  delete(id: number): Observable<any> {
    this.activityTracker.trackEnquiryActivity('Deleted', `Enquiry deleted`, 'Admin');
    const endpoint = ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id);
    return this.http.delete<any>(endpoint).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Mark an enquiry as read (isRead: true)
   */
  markAsRead(id: number): Observable<any> {
    const endpoint = ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id);
    this.activityTracker.trackEnquiryActivity('Marked as Read', `Enquiry marked as read`, 'Admin');
    return this.http.patch<any>(endpoint, { isRead: true }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Toggle the read status of an enquiry (isRead: !currentStatus)
   */
  toggleReadStatus(id: number, currentStatus: boolean): Observable<any> {
    const endpoint = ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id);
    const newStatus = !currentStatus;
    this.activityTracker.trackEnquiryActivity('Status Toggled', `Enquiry status toggled`, 'Admin');
    return this.http.patch<any>(endpoint, { isRead: newStatus }).pipe(
      map(res => res.data!)
    );
  }
}
