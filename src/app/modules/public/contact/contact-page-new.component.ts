import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnquiryService } from '../../admin/enquiry-manager/services/enquiry.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-page-new.component.html',
  styleUrls: ['./contact-page-new.component.scss']
})
export class ContactPageComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccess = false;
  showError = false;

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''], // Optional field
      company: [''], // Optional field
      subject: ['', [Validators.required, Validators.minLength(5)]],
      service: ['General Inquiry'], // Default service
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.showSuccess = false;
      this.showError = false;

      const formData = this.contactForm.value;
      
      this.enquiryService.add(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.showSuccess = true;
          this.contactForm.reset();
          
          // Scroll to success message
          setTimeout(() => {
            document.querySelector('.alert-success')?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }, 100);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showError = true;
          // removed log
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
