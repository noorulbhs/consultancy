import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { EnquiryService } from '../../services/enquiry.service';

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  service?: string;
  message: string;
  date: string;
  isRead: boolean;
}

@Component({
  selector: 'app-enquiry-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  enquiries: Enquiry[] = [];
  selectedEnquiry: Enquiry | null = null;
  private enquiriesSubscription: Subscription = new Subscription();

  constructor(private enquiryService: EnquiryService) {
  }

  ngOnInit(): void {
    this.loadEnquiries();
  }

  ngOnDestroy(): void {
    this.enquiriesSubscription.unsubscribe();
  }

  loadEnquiries(): void {
    this.enquiriesSubscription = this.enquiryService.getAll().subscribe((data: Enquiry[]) => {
      this.enquiries = Array.isArray(data) ? data : [];
    });
  }

  refreshEnquiries(): void {
    // Data is automatically refreshed via subscription when service data changes
    this.loadEnquiries();
  }

  get readCount(): number {
    return this.enquiries.filter(e => e.isRead).length;
  }

  get unreadCount(): number {
    return this.enquiries.filter(e => !e.isRead).length;
  }

  viewDetails(enquiry: Enquiry): void {
    this.selectedEnquiry = enquiry;
    // Auto-mark as read when viewing details
    // if (!enquiry.isRead) {
    //   this.markAsRead(enquiry.id);
    // }
    // Trigger Bootstrap modal (you can use a proper modal service if available)
    const modal = document.getElementById('detailsModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  markAsRead(id: number): void {
    this.enquiryService.toggleReadStatus(id, true).subscribe(() => {
      // Data will be automatically updated via subscription
      if (this.selectedEnquiry && this.selectedEnquiry.id === id) {
        this.selectedEnquiry.isRead = true;
      }
    });
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      this.enquiryService.delete(id).subscribe(() => {
        // Remove the deleted enquiry from the list immediately
        this.enquiries = this.enquiries.filter(e => e.id !== id);
        if (this.selectedEnquiry && this.selectedEnquiry.id === id) {
          this.selectedEnquiry = null;
        }
      });
    }
  }

  toggleStatus(id: number, isRead: boolean): void {
    this.enquiryService.toggleReadStatus(id, isRead).subscribe(() => {
      // Update the local enquiry immediately for instant UI feedback
      const enquiry = this.enquiries.find(e => e.id === id);
      if (enquiry) {
        enquiry.isRead = isRead;
      }
      if (this.selectedEnquiry && this.selectedEnquiry.id === id) {
        this.selectedEnquiry.isRead = isRead;
      }
    });
  }

  isQuoteEnquiry(enquiry: any): boolean {
    return enquiry.message && enquiry.message.includes('=== QUOTE REQUEST');
  }

  parseQuoteMessage(message: string): any {
    const sections: any = {};
    
    // Extract quote ID
    const quoteIdMatch = message.match(/💼 Quote ID: (QR-\d+)/);
    sections.quoteId = quoteIdMatch ? quoteIdMatch[1] : null;
    
    // Check if urgent
    sections.isUrgent = message.includes('(URGENT PROJECT)');
    
    // Check for ongoing support in multiple possible locations
    sections.ongoingSupport = message.includes('✓ Requires ongoing support and maintenance') || 
                              message.includes('Requires ongoing support') ||
                              message.includes('ongoing support');
    
    // Extract project overview
    const projectOverviewMatch = message.match(/📋 PROJECT OVERVIEW:\n(.*?)(?=\n\n|\n👤)/s);
    if (projectOverviewMatch) {
      const overviewText = projectOverviewMatch[1];
      
      sections.projectType = this.extractValue(overviewText, 'Project Type');
      sections.timeline = this.extractValue(overviewText, 'Timeline');
      sections.budget = this.extractValue(overviewText, 'Budget Range');
      
      // Double-check ongoing support in overview section
      if (overviewText.includes('✓ Requires ongoing support')) {
        sections.ongoingSupport = true;
      }
    }
    
    // Extract project details
    const projectDetailsMatch = message.match(/📝 PROJECT DETAILS:\n(.*?)(?=\n\n|🔧|🎯)/s);
    sections.projectDetails = projectDetailsMatch ? projectDetailsMatch[1].trim() : '';
    
    // Extract additional requirements
    const additionalReqMatch = message.match(/🔧 ADDITIONAL REQUIREMENTS:\n(.*?)(?=\n\n|🎯)/s);
    sections.additionalRequirements = additionalReqMatch ? additionalReqMatch[1].trim() : '';
    
    // Extract service information
    const serviceInfoMatch = message.match(/🎯 SELECTED SERVICE:\n(.*?)(?=\n\n|📅)/s);
    if (serviceInfoMatch) {
      const serviceText = serviceInfoMatch[1];
      sections.selectedService = this.extractValue(serviceText, 'Service');
      sections.serviceCategory = this.extractValue(serviceText, 'Category');
      sections.basePrice = this.extractValue(serviceText, 'Base Price');
      sections.duration = this.extractValue(serviceText, 'Duration');
    }
    
    // Extract submission date
    const submittedMatch = message.match(/📅 Submitted: (.*?)(?=\n|$)/);
    sections.submittedDate = submittedMatch ? submittedMatch[1] : '';
    
    return sections;
  }

  private extractValue(text: string, label: string): string {
    const regex = new RegExp(`• ${label}: (.*)(?=\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }
}
