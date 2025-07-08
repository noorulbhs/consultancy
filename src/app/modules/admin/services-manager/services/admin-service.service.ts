import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SERVICE_DATA } from '../mock/service-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private services = [...SERVICE_DATA];

  constructor(private activityTracker: ActivityTrackerService) {}

  getAll(): Observable<any[]> {
    return of(this.services);
  }

  getById(id: number): Observable<any> {
    return of(this.services.find(s => s.id === id));
  }

  add(service: any): Observable<any> {
    this.services.push({ ...service, id: Date.now() });
    
    // Track activity
    this.activityTracker.trackServiceActivity('Created', service.title || 'New Service', 'Admin');
    
    return of(service);
  }

  update(id: number, updated: any): Observable<any> {
    const index = this.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.services[index] = { ...updated, id };
      
      // Track activity
      this.activityTracker.trackServiceActivity('Updated', updated.title || 'Service', 'Admin');
    }
    return of(updated);
  }

  delete(id: number): Observable<any> {
    const serviceToDelete = this.services.find(s => s.id === id);
    this.services = this.services.filter(s => s.id !== id);
    
    // Track activity
    if (serviceToDelete) {
      this.activityTracker.trackServiceActivity('Deleted', serviceToDelete.title || 'Service', 'Admin');
    }
    
    return of({ success: true });
  }
}
