import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MOCK_TESTIMONIALS } from '../mock/testimonials-data';
import { Testimonial } from '../../../../core/interfaces/content.interface';
import { HttpService } from '../../../../core/services/http.service';
import { DataSourceService } from '../../../../core/services/data-source.service';
import { PUBLIC_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  constructor(
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {}

  getTestimonials(): Observable<Testimonial[]> {
    if (this.dataSourceService.shouldUseRealData('testimonials')) {
      return this.getTestimonialsFromAPI();
    } else {
      return this.getTestimonialsFromMock();
    }
  }

  private getTestimonialsFromAPI(): Observable<Testimonial[]> {
    return this.httpService.get<Testimonial[]>(
      PUBLIC_API_ENDPOINTS.TESTIMONIALS,
      { isPublic: true }
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching testimonials from API, falling back to mock data:', error);
        return this.getTestimonialsFromMock();
      })
    );
  }

  private getTestimonialsFromMock(): Observable<Testimonial[]> {
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
