import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestimonialService, Testimonial } from '../../../../admin/testimonial-manager/services/testimonial.service';
import { FeatureToggleService } from '../../../../admin/services/feature-toggle.service';

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
  showMoreStories = true;

  constructor(
    private testimonialService: TestimonialService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    this.testimonialService.getAll().subscribe((data: Testimonial[]) => {
      this.testimonials = data.filter((t: Testimonial) => t.published);
      this.featuredTestimonials = this.testimonials.filter((t: Testimonial) => t.featured);
    });

    // Load feature toggle state
    this.featureToggleService.getFeatures().subscribe(() => {
      this.showMoreStories = this.featureToggleService.isFeatureEnabled('testimonials-more-stories');
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredTestimonials.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.featuredTestimonials.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
