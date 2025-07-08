import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_TESTIMONIALS } from '../mock/testimonials-data';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  constructor() {}

  getTestimonials(): Observable<any[]> {
    return of(MOCK_TESTIMONIALS); // Replace with HTTP call later
  }
}
