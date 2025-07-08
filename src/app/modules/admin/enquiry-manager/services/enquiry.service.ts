import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ENQUIRY_DATA } from '../mock/enquiry-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private enquiries = [...ENQUIRY_DATA];
  private enquiriesSubject = new BehaviorSubject<any[]>(this.enquiries);

  constructor(private activityTracker: ActivityTrackerService) {
  }

  getAll(): Observable<any[]> {
    return this.enquiriesSubject.asObservable();
  }

  add(enquiry: any): Observable<any> {
    const newEnquiry = {
      ...enquiry,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };
    
    this.enquiries.unshift(newEnquiry); // Add to the beginning of the array
    
    // Emit the updated list to all subscribers
    this.enquiriesSubject.next([...this.enquiries]);
    
    // Track activity
    this.activityTracker.trackEnquiryActivity('Received', `New enquiry from ${enquiry.name || 'Unknown'}: ${enquiry.subject || 'No subject'}`, 'System');
    
    return of(newEnquiry);
  }

  delete(id: number): Observable<any> {
    const enquiryToDelete = this.enquiries.find(e => e.id === id);
    this.enquiries = this.enquiries.filter(e => e.id !== id);
    // Emit the updated list to all subscribers
    this.enquiriesSubject.next([...this.enquiries]);
    
    // Track activity
    if (enquiryToDelete) {
      this.activityTracker.trackEnquiryActivity('Deleted', `Enquiry from ${enquiryToDelete.name || 'Unknown'} deleted`, 'Admin');
    }
    
    return of({ success: true });
  }

  toggleReadStatus(id: number): Observable<any> {
    const enquiry = this.enquiries.find(e => e.id === id);
    if (enquiry) {
      enquiry.isRead = !enquiry.isRead;
      // Emit the updated list to all subscribers
      this.enquiriesSubject.next([...this.enquiries]);
      
      // Track activity
      const status = enquiry.isRead ? 'Read' : 'Marked as Unread';
      this.activityTracker.trackEnquiryActivity(status, `Enquiry from ${enquiry.name || 'Unknown'} marked as ${enquiry.isRead ? 'read' : 'unread'}`, 'Admin');
      
      return of({ status: enquiry.isRead });
    }
    return of({ status: false, error: 'Enquiry not found' });
  }
}
