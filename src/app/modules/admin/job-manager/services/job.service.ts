import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JOB_DATA } from '../mock/job-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobs = [...JOB_DATA];

  constructor(private activityTracker: ActivityTrackerService) {}

  getAll(): Observable<any[]> {
    return of(this.jobs);
  }

  getById(id: number): Observable<any> {
    return of(this.jobs.find(j => j.id === id));
  }

  add(job: any): Observable<any> {
    job.id = Date.now();
    this.jobs.push(job);
    
    // Track activity
    this.activityTracker.trackJobActivity('Created', job.title || 'New Job Position', 'Admin');
    
    return of(job);
  }

  update(id: number, updated: any): Observable<any> {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      this.jobs[index] = { ...updated, id };
      
      // Track activity
      this.activityTracker.trackJobActivity('Updated', updated.title || 'Job Position', 'Admin');
    }
    return of(updated);
  }

  delete(id: number): Observable<any> {
    const jobToDelete = this.jobs.find(j => j.id === id);
    this.jobs = this.jobs.filter(j => j.id !== id);
    
    // Track activity
    if (jobToDelete) {
      this.activityTracker.trackJobActivity('Deleted', jobToDelete.title || 'Job Position', 'Admin');
    }
    
    return of({ success: true });
  }

  toggleStatus(id: number): Observable<any> {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      const oldStatus = this.jobs[index].isOpen;
      this.jobs[index].isOpen = !this.jobs[index].isOpen;
      
      // Track activity
      const status = this.jobs[index].isOpen ? 'Opened' : 'Closed';
      this.activityTracker.trackJobActivity(status, this.jobs[index].title || 'Job Position', 'Admin');
    }
    return of({ status: this.jobs[index].isOpen });
  }
}
