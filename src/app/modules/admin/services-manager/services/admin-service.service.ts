import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { SERVICE_DATA } from '../mock/service-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private storageKey = 'services';
  private services = this.loadServices();
  private servicesSubject = new BehaviorSubject<any[]>(this.services);
  private loadServices(): any[] {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    return [...SERVICE_DATA];
  }

  private saveServices(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.services));
  }

  constructor(private activityTracker: ActivityTrackerService) {}

  getAll(): Observable<any[]> {
    return this.servicesSubject.asObservable();
  }

  getById(id: number): Observable<any> {
    return of(this.services.find(s => s.id === id));
  }

  add(service: any): Observable<any> {
    const newService = { ...service, id: Date.now() };
    this.services.push(newService);
    this.saveServices();
    this.servicesSubject.next([...this.services]);
    // Track activity
    this.activityTracker.trackServiceActivity('Created', service.title || 'New Service', 'Admin');
    return of(newService);
  }

  update(id: number, updated: any): Observable<any> {
    const index = this.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.services[index] = { ...updated, id };
      this.saveServices();
      this.servicesSubject.next([...this.services]);
      // Track activity
      this.activityTracker.trackServiceActivity('Updated', updated.title || 'Service', 'Admin');
    }
    return of(updated);
  }

  delete(id: number): Observable<any> {
    const serviceToDelete = this.services.find(s => s.id === id);
    this.services = this.services.filter(s => s.id !== id);
    this.saveServices();
    this.servicesSubject.next([...this.services]);
    // Track activity
    if (serviceToDelete) {
      this.activityTracker.trackServiceActivity('Deleted', serviceToDelete.title || 'Service', 'Admin');
    }
    return of({ success: true });
  }
}
