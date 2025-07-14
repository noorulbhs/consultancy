import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnquiryService } from '../../admin/enquiry-manager/services/enquiry.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { SiteSettings } from '../../../core/interfaces/site-settings.interface';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  service: string;
  message: string;
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    service: '',
    message: ''
  };
  
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  siteSettings: any = {};
  subjectOptions: Array<{value: string, label: string}> = [];
  serviceOptions: Array<{value: string, label: string}> = [];

  constructor(
    private enquiryService: EnquiryService,
    private settingsService: SiteSettingsService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.settingsService.getSettings().subscribe((settings: SiteSettings) => {
      this.siteSettings = settings;
      // Filter and map enabled options
      this.subjectOptions = settings.contactForm.subjectOptions
        .filter((option: any) => option.enabled)
        .map((option: any) => ({ value: option.value, label: option.label }));
      this.serviceOptions = settings.contactForm.serviceOptions
        .filter((option: any) => option.enabled)
        .map((option: any) => ({ value: option.value, label: option.label }));
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.submitMessage = '';
    
    // Submit to enquiry service
    const enquiryData = {
      ...this.formData,
      date: new Date().toISOString().split('T')[0], // Current date
      isRead: false
    };
    
    this.enquiryService.add(enquiryData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.submitMessage = 'Thank you for your message! We will get back to you within 24 hours.';
        
        // Reset form
        this.formData = {
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          service: '',
          message: ''
        };
        
        // Clear message after 5 seconds
        setTimeout(() => {
          this.submitMessage = '';
          this.submitSuccess = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Error submitting contact form:', error);
        this.isSubmitting = false;
        this.submitSuccess = false;
        this.submitMessage = 'There was an error submitting your message. Please try again.';
        
        setTimeout(() => {
          this.submitMessage = '';
        }, 5000);
      }
    });
  }
}
