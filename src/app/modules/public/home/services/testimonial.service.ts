import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MOCK_TESTIMONIALS } from '../mock/testimonials-data';
import { Testimonial } from '../../../../core/interfaces/content.interface';
import { DataSourceService } from '../../../../core/services/data-source.service';
import { HttpService } from '../../../../core/services/http.service';
import { PUBLIC_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private storageKey = 'testimonials';

  constructor(
    private dataSourceService: DataSourceService,
    private httpService: HttpService
  ) {}

  getTestimonials(): Observable<Testimonial[]> {
    if (this.dataSourceService.shouldUseRealData('testimonials')) {
      return this.getTestimonialsFromAPI();
    } else {
      return this.getTestimonialsFromLocalStorage();
    }
  }

  private getTestimonialsFromAPI(): Observable<Testimonial[]> {
    return this.httpService.get<Testimonial[]>(
      PUBLIC_API_ENDPOINTS.TESTIMONIALS,
      { isPublic: true }
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        // removed log
        return of(MOCK_TESTIMONIALS);
      })
    );
  }

  private getTestimonialsFromLocalStorage(): Observable<Testimonial[]> {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return of(JSON.parse(saved));
      } catch {
        return of(MOCK_TESTIMONIALS);
      }
    }
    return of(MOCK_TESTIMONIALS);
  }

  // Get featured testimonials only
  getFeaturedTestimonials(): Observable<Testimonial[]> {
    return this.getTestimonials().pipe(
      map(testimonials => testimonials.filter(testimonial => testimonial.featured))
    );
  }

  // Get testimonials by rating
  getTestimonialsByRating(minRating: number): Observable<Testimonial[]> {
    return this.getTestimonials().pipe(
      map(testimonials => testimonials.filter(testimonial => testimonial.rating >= minRating))
    );
  }

  // Get testimonial by ID
  getTestimonialById(id: number): Observable<Testimonial | undefined> {
    return this.getTestimonials().pipe(
      map(testimonials => testimonials.find(testimonial => testimonial.id === id))
    );
  }
}
