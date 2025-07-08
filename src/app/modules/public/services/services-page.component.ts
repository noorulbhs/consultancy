import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from '../../admin/services-manager/services/admin-service.service';
import { EnquiryService } from '../../admin/enquiry-manager/services/enquiry.service';

interface Service {
  id: number;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  icon: string;
  features: string[];
  technologies: string[];
  price: string;
  duration: string;
  deliverables: string[];
  clientTypes: string[];
  caseStudy: {
    client: string;
    challenge: string;
    solution: string;
    results: string;
  };
  featured: boolean;
  status: string;
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  selectedCategory: string = 'all';
  selectedService: Service | null = null;
  quoteForm: FormGroup;
  
  // Success/Error state management
  showQuoteSuccess = false;
  showQuoteError = false;
  quoteSuccessMessage = '';
  quoteErrorMessage = '';
  isSubmittingQuote = false;

  constructor(
    private serviceService: AdminServiceService,
    private router: Router,
    private fb: FormBuilder,
    private enquiryService: EnquiryService
  ) {
    this.quoteForm = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: [''],
      company: [''],
      projectType: ['', Validators.required],
      projectDetails: ['', [Validators.required, Validators.minLength(50)]],
      timeline: ['', Validators.required],
      budget: ['', Validators.required],
      additionalRequirements: [''],
      urgentProject: [false],
      ongoingSupport: [false]
    });
  }

  ngOnInit(): void {
    this.serviceService.getAll().subscribe((data: Service[]) => {
      this.services = data;
      this.filteredServices = data;
    });
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.services.map(service => service.category))];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter(service => service.category === category);
    }
  }

  openServiceModal(service: Service): void {
    this.selectedService = service;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
  }

  requestQuote(service: Service): void {
    this.selectedService = service;
    this.quoteForm.reset();
    this.quoteForm.patchValue({
      urgentProject: false,
      ongoingSupport: false
    });
    
    // Reset all states
    this.showQuoteSuccess = false;
    this.showQuoteError = false;
    this.isSubmittingQuote = false;
    
    const modal = new (window as any).bootstrap.Modal(document.getElementById('quoteModal'));
    modal.show();
  }

  submitQuote(): void {
    if (this.quoteForm.invalid) {
      this.markQuoteFormFieldsAsTouched();
      return;
    }

    // Start loading state
    this.isSubmittingQuote = true;
    this.showQuoteSuccess = false;
    this.showQuoteError = false;

    const formData = this.quoteForm.value;
    
    const enquiryData = {
      name: formData.clientName,
      email: formData.clientEmail,
      phone: formData.clientPhone || 'Not provided',
      company: formData.company || 'Individual/Startup',
      subject: `Quote Request: ${this.getProjectTypeLabel(formData.projectType)} - ${this.getBudgetLabel(formData.budget)}`,
      service: this.selectedService?.title || 'General Quote Request',
      message: this.buildQuoteMessage(formData),
      // The enquiry service will automatically add: id, date, isRead
    };

    // Save to enquiries
    this.enquiryService.add(enquiryData).subscribe({
      next: (response) => {
        this.isSubmittingQuote = false;
        
        // Show success popup
        this.quoteSuccessMessage = `Quote request submitted successfully! We'll contact you within 24 hours at ${formData.clientEmail}. Your reference ID is: QR-${response.id}`;
        this.showQuoteSuccess = true;
        this.showQuoteError = false;
        
        // Reset form
        this.quoteForm.reset();
        this.quoteForm.patchValue({
          urgentProject: false,
          ongoingSupport: false
        });
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          this.closeQuoteModal();
        }, 3000);
      },
      error: (error) => {
        this.isSubmittingQuote = false;
        
        // Show error popup
        this.quoteErrorMessage = 'There was an error submitting your quote request. Please try again or contact us directly.';
        this.showQuoteError = true;
        this.showQuoteSuccess = false;
      }
    });
  }

  private buildQuoteMessage(formData: any): string {
    const urgentText = formData.urgentProject ? ' (URGENT PROJECT)' : '';
    const supportText = formData.ongoingSupport ? '\n✓ Requires ongoing support and maintenance' : '';
    
    let message = `=== QUOTE REQUEST${urgentText} ===\n\n`;
    
    // Project Overview
    message += `📋 PROJECT OVERVIEW:\n`;
    message += `• Project Type: ${this.getProjectTypeLabel(formData.projectType)}\n`;
    message += `• Timeline: ${this.getTimelineLabel(formData.timeline)}\n`;
    message += `• Budget Range: ${this.getBudgetLabel(formData.budget)}\n`;
    if (formData.urgentProject) {
      message += `• Priority: URGENT/RUSH JOB\n`;
    }
    message += supportText + '\n\n';
    
    // Client Information
    message += `👤 CLIENT INFORMATION:\n`;
    message += `• Name: ${formData.clientName}\n`;
    message += `• Email: ${formData.clientEmail}\n`;
    if (formData.clientPhone) {
      message += `• Phone: ${formData.clientPhone}\n`;
    }
    if (formData.company) {
      message += `• Company: ${formData.company}\n`;
    }
    message += '\n';
    
    // Project Details
    message += `📝 PROJECT DETAILS:\n`;
    message += `${formData.projectDetails}\n\n`;
    
    // Additional Requirements
    if (formData.additionalRequirements) {
      message += `🔧 ADDITIONAL REQUIREMENTS:\n`;
      message += `${formData.additionalRequirements}\n\n`;
    }
    
    // Service Information
    if (this.selectedService) {
      message += `🎯 SELECTED SERVICE:\n`;
      message += `• Service: ${this.selectedService.title}\n`;
      message += `• Category: ${this.selectedService.category}\n`;
      message += `• Base Price: ${this.selectedService.price}\n`;
      message += `• Duration: ${this.selectedService.duration}\n\n`;
    }
    
    message += `📅 Submitted: ${new Date().toLocaleString()}\n`;
    message += `💼 Quote ID: QR-${Date.now()}`;

    return message;
  }

  private getProjectTypeLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'new-development': 'New Development Project',
      'redesign': 'Redesign/Modernization',
      'maintenance': 'Maintenance & Support',
      'consultation': 'Consultation Only',
      'migration': 'System Migration',
      'integration': 'Third-party Integration',
      'custom': 'Custom Solution'
    };
    return labels[value] || value;
  }

  private getTimelineLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'asap': 'ASAP (Rush)',
      '1-2-weeks': '1-2 Weeks',
      '3-4-weeks': '3-4 Weeks',
      '1-2-months': '1-2 Months',
      '3-6-months': '3-6 Months',
      '6-months-plus': '6+ Months',
      'flexible': 'Flexible'
    };
    return labels[value] || value;
  }

  private getBudgetLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'under-5k': 'Under $5,000',
      '5k-10k': '$5,000 - $10,000',
      '10k-25k': '$10,000 - $25,000',
      '25k-50k': '$25,000 - $50,000',
      '50k-100k': '$50,000 - $100,000',
      '100k-plus': '$100,000+',
      'custom': 'Custom/Discuss'
    };
    return labels[value] || value;
  }

  isQuoteFieldInvalid(fieldName: string): boolean {
    const field = this.quoteForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  markQuoteFormFieldsAsTouched(): void {
    Object.keys(this.quoteForm.controls).forEach(key => {
      this.quoteForm.get(key)?.markAsTouched();
    });
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }

  closeQuoteModal(): void {
    const modal = document.getElementById('quoteModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  dismissQuoteSuccess(): void {
    this.showQuoteSuccess = false;
  }

  dismissQuoteError(): void {
    this.showQuoteError = false;
  }
}
