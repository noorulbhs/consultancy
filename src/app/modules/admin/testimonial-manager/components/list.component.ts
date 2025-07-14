import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TestimonialService } from '../services/testimonial.service';
import { Testimonial } from '../../../../core/interfaces/content.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-testimonial-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  testimonials: Testimonial[] = [];
  filteredTestimonials: Testimonial[] = [];
  sortedBy: 'date' | 'name' | 'rating' | 'company' = 'date';
  filterStatus: string = 'all';
  searchTerm: string = '';
  selectedTestimonial: Testimonial | null = null;

  constructor(private testimonialService: TestimonialService, public router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.testimonialService.getAll().subscribe((data) => {
      this.testimonials = [...data];
      this.sort();
      this.applyFilter();
    });
  }

  sort() {
    switch (this.sortedBy) {
      case 'name':
        this.testimonials.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        this.testimonials.sort((a, b) => b.rating - a.rating);
        break;
      case 'company':
        this.testimonials.sort((a, b) => a.company.localeCompare(b.company));
        break;
      default: // date
        this.testimonials.sort((a, b) => b.id - a.id);
    }
    this.applyFilter();
  }

  applyFilter() {
    let filtered = [...this.testimonials];

    // Apply status filter
    switch (this.filterStatus) {
      case 'published':
        filtered = filtered.filter(t => t.published);
        break;
      case 'unpublished':
        filtered = filtered.filter(t => !t.published);
        break;
      case 'featured':
        filtered = filtered.filter(t => t.featured);
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.company.toLowerCase().includes(term) ||
        t.designation.toLowerCase().includes(term) ||
        t.message.toLowerCase().includes(term)
      );
    }

    this.filteredTestimonials = filtered;
  }

  getPublishedCount(): number {
    return this.testimonials.filter(t => t.published).length;
  }

  getFeaturedCount(): number {
    return this.testimonials.filter(t => t.featured).length;
  }

  getAverageRating(): number {
    if (this.testimonials.length === 0) return 0;
    const sum = this.testimonials.reduce((acc, t) => acc + t.rating, 0);
    return sum / this.testimonials.length;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  preview(testimonial: Testimonial) {
    this.selectedTestimonial = testimonial;
    const modal = new bootstrap.Modal(document.getElementById('previewModal')!);
    modal.show();
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      this.testimonialService.delete(id).subscribe(() => {
        // Remove from local arrays immediately for instant UI update
        this.testimonials = this.testimonials.filter(t => t.id !== id);
        this.applyFilter();
      });
    }
  }
}
