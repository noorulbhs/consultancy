import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Enquiry } from '../../../../core/interfaces/content.interface';
import { HttpService } from '../../../../core/services/http.service';
import { DataSourceService } from '../../../../core/services/data-source.service';
import { PUBLIC_API_ENDPOINTS, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private mockEnquiries: Enquiry[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      company: 'Tech Corp',
      subject: 'general',
      service: 'Cloud Migration',
      message: 'We are interested in migrating our legacy systems to the cloud.',
      date: '2024-01-15',
      isRead: false,
      referenceNumber: 'ALT-2024-0001'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0456',
      company: 'StartupXYZ',
      subject: 'consultation',
      service: 'DevOps Strategy',
      message: 'Looking for a free consultation on DevOps implementation.',
      date: '2024-01-14',
      isRead: true,
      referenceNumber: 'ALT-2024-0002'
    }
  ];

  constructor(
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {}

  // Submit enquiry (public endpoint)
  submitEnquiry(enquiry: Partial<Enquiry>): Observable<{ success: boolean; message: string; data?: any }> {
    if (this.dataSourceService.shouldUseRealData('enquiries')) {
      return this.httpService.post(
        PUBLIC_API_ENDPOINTS.ENQUIRIES,
        enquiry,
        { isPublic: true }
      ).pipe(
        map(response => ({
          success: true,
          message: 'Thank you for your enquiry! We will get back to you within 24 hours.',
          data: response.data
        })),
        catchError(error => {
          console.error('Error submitting enquiry:', error);
          return of({ success: false, message: 'Failed to submit enquiry. Please try again.' });
        })
      );
    } else {
      // Mock submission
      const newEnquiry = {
        ...enquiry,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        isRead: false,
        referenceNumber: `ALT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
      };
      this.mockEnquiries.push(newEnquiry as Enquiry);
      return of({
        success: true,
        message: 'Thank you for your enquiry! We will get back to you within 24 hours.',
        data: { id: newEnquiry.id, referenceNumber: newEnquiry.referenceNumber }
      });
    }
  }

  // Get all enquiries (admin only)
  getAllEnquiries(): Observable<Enquiry[]> {
    if (this.dataSourceService.shouldUseRealData('enquiries')) {
      return this.httpService.get<Enquiry[]>(
        ADMIN_API_ENDPOINTS.ENQUIRIES,
        { isPublic: false }
      ).pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching enquiries from API:', error);
          return of(this.mockEnquiries);
        })
      );
    } else {
      return of(this.mockEnquiries);
    }
  }

  // Get enquiry by ID (admin only)
  getEnquiryById(id: number): Observable<Enquiry | undefined> {
    if (this.dataSourceService.shouldUseRealData('enquiries')) {
      return this.httpService.get<Enquiry>(
        ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id),
        { isPublic: false }
      ).pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching enquiry from API:', error);
          return of(undefined);
        })
      );
    } else {
      return of(this.mockEnquiries.find(enquiry => enquiry.id === id));
    }
  }

  // Update enquiry status (admin only)
  updateEnquiryStatus(id: number, isRead: boolean): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('enquiries')) {
      return this.httpService.put(
        ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id),
        { isRead },
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Enquiry status updated successfully' })),
        catchError(error => {
          console.error('Error updating enquiry status:', error);
          return of({ success: false, message: 'Failed to update enquiry status' });
        })
      );
    } else {
      const enquiry = this.mockEnquiries.find(e => e.id === id);
      if (enquiry) {
        enquiry.isRead = isRead;
        return of({ success: true, message: 'Enquiry status updated successfully' });
      }
      return of({ success: false, message: 'Enquiry not found' });
    }
  }

  // Delete enquiry (admin only)
  deleteEnquiry(id: number): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('enquiries')) {
      return this.httpService.delete(
        ADMIN_API_ENDPOINTS.ENQUIRY_BY_ID(id),
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Enquiry deleted successfully' })),
        catchError(error => {
          console.error('Error deleting enquiry:', error);
          return of({ success: false, message: 'Failed to delete enquiry' });
        })
      );
    } else {
      const index = this.mockEnquiries.findIndex(e => e.id === id);
      if (index !== -1) {
        this.mockEnquiries.splice(index, 1);
        return of({ success: true, message: 'Enquiry deleted successfully' });
      }
      return of({ success: false, message: 'Enquiry not found' });
    }
  }

  // Get unread enquiries count
  getUnreadCount(): Observable<number> {
    return this.getAllEnquiries().pipe(
      map(enquiries => enquiries.filter(enquiry => !enquiry.isRead).length)
    );
  }

  // Get enquiries by filters
  getEnquiriesByFilters(filters: {
    isRead?: boolean;
    subject?: string;
    service?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<Enquiry[]> {
    return this.getAllEnquiries().pipe(
      map(enquiries => {
        let filtered = enquiries;

        if (filters.isRead !== undefined) {
          filtered = filtered.filter(e => e.isRead === filters.isRead);
        }

        if (filters.subject) {
          filtered = filtered.filter(e => e.subject === filters.subject);
        }

        if (filters.service) {
          filtered = filtered.filter(e => e.service === filters.service);
        }

        if (filters.dateFrom) {
          filtered = filtered.filter(e => e.date >= filters.dateFrom!);
        }

        if (filters.dateTo) {
          filtered = filtered.filter(e => e.date <= filters.dateTo!);
        }

        return filtered;
      })
    );
  }

  // Get enquiries statistics
  getEnquiryStatistics(): Observable<{
    total: number;
    unread: number;
    thisMonth: number;
    lastMonth: number;
  }> {
    return this.getAllEnquiries().pipe(
      map(enquiries => {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        return {
          total: enquiries.length,
          unread: enquiries.filter(e => !e.isRead).length,
          thisMonth: enquiries.filter(e => {
            const enquiryDate = new Date(e.date);
            return enquiryDate >= thisMonth && enquiryDate < nextMonth;
          }).length,
          lastMonth: enquiries.filter(e => {
            const enquiryDate = new Date(e.date);
            return enquiryDate >= lastMonth && enquiryDate < thisMonth;
          }).length
        };
      })
    );
  }
}
