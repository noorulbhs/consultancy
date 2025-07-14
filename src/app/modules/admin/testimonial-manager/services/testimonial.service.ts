import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { buildApiUrl, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  companyLogo?: string;
  message: string;
  rating: number;
  photoUrl?: string;
  published: boolean;
  featured?: boolean;
  date?: string;
  projectType?: string;
  location?: string;
  tags?: string[];
}

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private testimonialsUrl = ADMIN_API_ENDPOINTS.TESTIMONIALS;

  constructor(
    private http: HttpService,
    private activityTracker: ActivityTrackerService
  ) {}

  getAll(): Observable<Testimonial[]> {
    return this.http.get<any>(ADMIN_API_ENDPOINTS.TESTIMONIALS).pipe(
      map(res => Array.isArray(res.data?.content) ? res.data.content : [])
    );
  }

  getById(id: number): Observable<Testimonial> {
    return this.http.get<Testimonial>(ADMIN_API_ENDPOINTS.TESTIMONIAL_BY_ID(id)).pipe(
      map(res => res.data!)
    );
  }

  add(data: Testimonial): Observable<Testimonial> {
    this.activityTracker.trackTestimonialActivity('Added', data.name, 'Admin');
    return this.http.post<Testimonial>(ADMIN_API_ENDPOINTS.TESTIMONIALS, data).pipe(
      map(res => res.data!)
    );
  }

  update(id: number, data: Testimonial): Observable<Testimonial> {
    this.activityTracker.trackTestimonialActivity('Updated', data.name, 'Admin');
    return this.http.put<Testimonial>(ADMIN_API_ENDPOINTS.TESTIMONIAL_BY_ID(id), data).pipe(
      map(res => res.data!)
    );
  }

  delete(id: number): Observable<any> {
    this.activityTracker.trackTestimonialActivity('Deleted', 'Testimonial', 'Admin');
    return this.http.delete<any>(ADMIN_API_ENDPOINTS.TESTIMONIAL_BY_ID(id)).pipe(
      map(res => res.data!)
    );
  }
}
