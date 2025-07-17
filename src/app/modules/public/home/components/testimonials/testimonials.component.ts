import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestimonialService } from '../../../../admin/testimonial-manager/services/testimonial.service';
import { Testimonial } from '../../../../../core/interfaces/content.interface';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  featuredTestimonials: Testimonial[] = [];
  currentSlide = 0;

  constructor(
    private testimonialService: TestimonialService
  ) {}

  ngOnInit(): void {
    this.testimonialService.getAllPublic().subscribe((data: Testimonial[]) => {
      this.testimonials = data.filter((t: Testimonial) => t.published);
      this.featuredTestimonials = this.testimonials.filter((t: Testimonial) => t.featured);
    });

    // Auto-slide every 6 seconds
    setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredTestimonials.length;
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.featuredTestimonials.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
