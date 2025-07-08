import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_TESTIMONIALS } from '../../../public/home/mock/testimonials-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

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
  private testimonials = [...MOCK_TESTIMONIALS];

  constructor(private activityTracker: ActivityTrackerService) {}

  getAll(): Observable<Testimonial[]> {
    return of(this.testimonials);
  }

  getById(id: number): Observable<Testimonial | undefined> {
    return of(this.testimonials.find(t => t.id === id));
  }

  add(data: Testimonial): Observable<void> {
    data.id = Date.now();
    this.testimonials.push(data);
    
    // Track activity
    this.activityTracker.trackTestimonialActivity('Added', data.name, 'Admin');
    
    return of();
  }

  update(id: number, data: Testimonial): Observable<void> {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      this.testimonials[index] = { ...data, id };
      
      // Track activity
      this.activityTracker.trackTestimonialActivity('Updated', data.name, 'Admin');
    }
    return of();
  }

  delete(id: number): Observable<void> {
    const testimonialToDelete = this.testimonials.find(t => t.id === id);
    this.testimonials = this.testimonials.filter(t => t.id !== id);
    
    // Track activity
    if (testimonialToDelete) {
      this.activityTracker.trackTestimonialActivity('Deleted', testimonialToDelete.name, 'Admin');
    }
    
    return of();
  }
}
