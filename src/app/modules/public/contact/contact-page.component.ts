import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnquiryService } from '../../admin/enquiry-manager/services/enquiry.service';
import { SettingsService } from '../../admin/site-settings/services/settings.service';
import { AdminServiceService } from '../../admin/services-manager/services/admin-service.service';

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
  // subjectOptions: Array<{value: string, label: string}> = [];
  serviceOptions: Array<{value: string, label: string}> = [];
  allServices: Array<{ value: string, label: string }> = [];

  constructor(
    private enquiryService: EnquiryService,
    private settingsService: SettingsService,
    private adminServiceService: AdminServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadSettings();
    await this.loadServiceOptions();
  }

  private loadSettings(): void {
    this.settingsService.getSettings().subscribe(settings => {
      this.siteSettings = settings;
    });
  }

  private async loadServiceOptions(): Promise<void> {
    try {
      const services: any[] = await firstValueFrom(this.adminServiceService.getAllPublic());
      this.serviceOptions = [
        ...(services || []).map(service => ({ value: service.title, label: service.title })),
        { value: 'Other', label: 'Other' }
      ];
    } catch {
      this.serviceOptions = [{ value: 'Other', label: 'Other' }];
    }
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
        // removed log
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
