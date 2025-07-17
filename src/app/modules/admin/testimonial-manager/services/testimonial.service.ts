
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Testimonial } from '../../../../core/interfaces/content.interface';
import { ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { PUBLIC_API_ENDPOINTS } from '../../../../core/constants/api-endpoints'; 
import { HttpService } from '../../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  constructor(private http: HttpService) {}

  getAll(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(ADMIN_API_ENDPOINTS.TESTIMONIALS).pipe(
      // Map to .data if API response is wrapped
      map((res: any) => res && (res.data || res) as Testimonial[])
    );
  }

  getAllPublic(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(PUBLIC_API_ENDPOINTS.TESTIMONIALS).pipe(
      // Map to .data if API response is wrapped
      map((res: any) => res && (res.data || res) as Testimonial[])
    );
  }

  getById(id: number): Observable<Testimonial> {
    return this.http.get<Testimonial>(ADMIN_API_ENDPOINTS.TESTIMONIAL_BY_ID(id)).pipe(
      map((res: any) => res && (res.data || res) as Testimonial)
    );
  }

  add(data: Testimonial): Observable<any> {
    return this.http.post<Testimonial>(ADMIN_API_ENDPOINTS.TESTIMONIALS, data);
  }

  update(id: number, data: Testimonial): Observable<any> {
    return this.http.put<Testimonial>(ADMIN_API_ENDPOINTS.TESTIMONIAL_BY_ID(id), data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(ADMIN_API_ENDPOINTS.TESTIMONIAL_BY_ID(id));
  }
}
