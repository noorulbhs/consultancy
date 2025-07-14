import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { MOCK_TESTIMONIALS } from '../../../public/home/mock/testimonials-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { Testimonial } from '../../../../core/interfaces/content.interface';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private storageKey = 'testimonials';
  private testimonials: Testimonial[] = this.loadTestimonials();
  private testimonialsSubject = new BehaviorSubject<Testimonial[]>(this.testimonials);

  constructor(private activityTracker: ActivityTrackerService) {}

  private loadTestimonials(): Testimonial[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [...MOCK_TESTIMONIALS];
      }
    }
    return [...MOCK_TESTIMONIALS];
  }

  private saveTestimonials(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.testimonials));
  }

  getAll(): Observable<Testimonial[]> {
    return this.testimonialsSubject.asObservable();
  }

  getById(id: number): Observable<Testimonial | undefined> {
    return of(this.testimonials.find(t => t.id === id));
  }

  add(data: Testimonial): Observable<void> {
    data.id = Date.now();
    this.testimonials.push(data);
    this.saveTestimonials();
    this.testimonialsSubject.next([...this.testimonials]);
    this.activityTracker.trackTestimonialActivity('Added', data.name, 'Admin');
    console.debug('[TestimonialService] Added testimonial:', data);
    return of(void 0);
  }

  update(id: number, data: Testimonial): Observable<void> {
    const index = this.testimonials.findIndex(t => t.id === id);
    console.debug('[TestimonialService] update called for id:', id, 'index:', index, 'data:', data);
    if (index !== -1) {
      this.testimonials[index] = { ...this.testimonials[index], ...data, id };
      this.saveTestimonials();
      this.testimonialsSubject.next([...this.testimonials]);
      this.activityTracker.trackTestimonialActivity('Updated', data.name, 'Admin');
      console.debug('[TestimonialService] Updated testimonial:', this.testimonials[index]);
    } else {
      console.warn('[TestimonialService] Tried to update testimonial but not found for id:', id);
    }
    return of(void 0);
  }

  delete(id: number): Observable<void> {
    const testimonialToDelete = this.testimonials.find(t => t.id === id);
    this.testimonials = this.testimonials.filter(t => t.id !== id);
    this.saveTestimonials();
    this.testimonialsSubject.next([...this.testimonials]);
    if (testimonialToDelete) {
      this.activityTracker.trackTestimonialActivity('Deleted', testimonialToDelete.name, 'Admin');
    }
    return of(void 0);
  }
}
