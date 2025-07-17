
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ADMIN_API_ENDPOINTS, PUBLIC_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  constructor(private http: HttpService) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(ADMIN_API_ENDPOINTS.ENQUIRIES).pipe(
      map((res: any) => {
        // Defensive: extract array from res.data.enquiries
        if (res && res.data && Array.isArray(res.data.enquiries)) {
          return res.data.enquiries;
        }
        return [];
      })
    );
  }

  add(enquiry: any): Observable<any> {
    return this.http.post<any>(PUBLIC_API_ENDPOINTS.ENQUIRIES, enquiry);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id));
  }

  toggleReadStatus(id: number): Observable<any> {
    // This assumes the backend supports a PATCH or PUT to toggle read status
    return this.http.put<any>(ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id), { toggleRead: true });
  }
}
