import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TestimonialService } from '../services/testimonial.service';
import { Testimonial } from '../../../../core/interfaces/content.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormValidationService } from '../../../../core/services/form-validation.service';

@Component({
  selector: 'app-testimonial-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  testimonialId: number | null = null;
  showValidationErrors = false;
  currentRating = 5; // Track current rating for immediate star updates
  
  fieldDisplayNames = {
    'name': 'Client Name',
    'designation': 'Designation', 
    'company': 'Company',
    'message': 'Testimonial Message',
    'rating': 'Rating'
  };

  constructor(
    private fb: FormBuilder,
    private testimonialService: TestimonialService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      company: ['', Validators.required],
      companyLogo: [''],
      message: ['', [Validators.required, Validators.minLength(20)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      photoUrl: [''],
      published: [true],
      featured: [false],
      date: [new Date().toISOString().split('T')[0]],
      projectType: [''],
      location: [''],
      tags: ['']
    });
    
    // Initialize currentRating with the default form value
    this.currentRating = 5;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.testimonialId = +id;
      this.testimonialService.getById(this.testimonialId).subscribe(testimonial => {
        if (testimonial) {
          this.form.patchValue({
            name: testimonial.name,
            designation: testimonial.designation,
            company: testimonial.company,
            companyLogo: testimonial.companyLogo || '',
            message: testimonial.message,
            rating: testimonial.rating,
            photoUrl: testimonial.photoUrl || '',
            published: testimonial.published,
            featured: testimonial.featured || false,
            date: testimonial.date || new Date().toISOString().split('T')[0],
            projectType: testimonial.projectType || '',
            location: testimonial.location || '',
            tags: testimonial.tags ? testimonial.tags.join(', ') : ''
          });
          // Update currentRating for star display
          this.currentRating = testimonial.rating;
        }
      });
    }
  }

  onSubmit() {
    this.submit();
  }

  submit() {
    this.showValidationErrors = true;
    
    if (this.form.invalid) {
      this.notificationService.error('Validation Error', 'Please fix all errors before submitting the form');
      return;
    }

    const formData = this.form.value;
    const testimonialData: Testimonial = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
      id: this.testimonialId || 0
    };

    if (this.editMode && this.testimonialId !== null) {
      this.testimonialService.update(this.testimonialId, testimonialData).subscribe({
        next: () => {
          this.notificationService.success('Success!', 'Testimonial updated successfully');
        },
        error: (error) => {
          this.notificationService.error('Error!', 'Failed to update testimonial. Please try again.');
        },
        complete: () => {
          this.router.navigate(['/admin-testimonials']);
        }
      });
    } else {
      this.testimonialService.add(testimonialData).subscribe({
        next: () => {
          this.notificationService.success('Success!', 'Testimonial added successfully');
          this.router.navigate(['/admin-testimonials']);
        },
        error: (error) => {
          this.notificationService.error('Error!', 'Failed to add testimonial. Please try again.');
        }
      });
    }
  }

  async validateForm() {
    await this.formValidationService.validateForm(this.form, this.fieldDisplayNames);
  }

  hasFieldError(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.form, fieldName, this.showValidationErrors);
  }

  getFieldError(fieldName: string): string {
    return this.formValidationService.getFieldError(this.form, fieldName, this.showValidationErrors, this.fieldDisplayNames);
  }

  goBack() {
    this.router.navigate(['/admin-testimonials']);
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getRatingValue(): number {
    const value = this.form.get('rating')?.value;
    return value ? parseInt(value, 10) : 0;
  }

  getCurrentRating(): number {
    return this.currentRating;
  }

  onRatingChange(event: any): void {
    const value = event.target.value;
    this.currentRating = parseInt(value, 10) || 0;
  }

  isStarFilled(starNumber: number): boolean {
    return starNumber <= this.currentRating;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }
}
