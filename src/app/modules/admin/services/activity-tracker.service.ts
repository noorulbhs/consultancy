import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ActivityItem } from '../mock/admin-dashboard-data';

@Injectable({
  providedIn: 'root'
})
export class ActivityTrackerService {
  private activitiesSubject = new BehaviorSubject<ActivityItem[]>([]);
  public activities$ = this.activitiesSubject.asObservable();

  constructor() {
    // Load activities from localStorage on service initialization
    this.loadActivitiesFromStorage();
  }

  private loadActivitiesFromStorage(): void {
    try {
      const storedActivities = localStorage.getItem('admin_activities');
      if (storedActivities) {
        const activities = JSON.parse(storedActivities).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
        this.activitiesSubject.next(activities);
      }
    } catch (error) {
      console.error('Error loading activities from storage:', error);
    }
  }

  private saveActivitiesToStorage(activities: ActivityItem[]): void {
    try {
      localStorage.setItem('admin_activities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities to storage:', error);
    }
  }

  addActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): void {
    const newActivity: ActivityItem = {
      ...activity,
      id: this.generateId(),
      timestamp: new Date()
    };

    const currentActivities = this.activitiesSubject.getValue();
    const updatedActivities = [newActivity, ...currentActivities].slice(0, 50); // Keep only latest 50 activities
    
    this.activitiesSubject.next(updatedActivities);
    this.saveActivitiesToStorage(updatedActivities);
  }

  getActivities(): Observable<ActivityItem[]> {
    return this.activities$;
  }

  getActivitiesByType(type: string): Observable<ActivityItem[]> {
    return this.activities$.pipe(
      map(activities => 
        type === 'all' 
          ? activities 
          : activities.filter(activity => activity.type === type)
      )
    );
  }

  clearActivities(): void {
    this.activitiesSubject.next([]);
    localStorage.removeItem('admin_activities');
  }

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper methods for common activity types
  trackProjectActivity(action: string, projectName: string, user: string, details?: string): void {
    this.addActivity({
      type: 'project',
      title: `Project ${action}`,
      description: details || `${projectName} has been ${action.toLowerCase()}`,
      user: user,
      status: this.getStatusFromAction(action)
    });
  }

  trackBlogActivity(action: string, blogTitle: string, user: string): void {
    this.addActivity({
      type: 'blog',
      title: `Blog ${action}`,
      description: `"${blogTitle}" has been ${action.toLowerCase()}`,
      user: user,
      status: this.getStatusFromAction(action)
    });
  }

  trackJobActivity(action: string, jobTitle: string, user: string): void {
    this.addActivity({
      type: 'job',
      title: `Job ${action}`,
      description: `${jobTitle} position has been ${action.toLowerCase()}`,
      user: user,
      status: this.getStatusFromAction(action)
    });
  }

  trackTeamActivity(action: string, memberName: string, user: string): void {
    this.addActivity({
      type: 'team',
      title: `Team Member ${action}`,
      description: `${memberName} has been ${action.toLowerCase()}`,
      user: user,
      status: this.getStatusFromAction(action)
    });
  }

  trackServiceActivity(action: string, serviceName: string, user: string): void {
    this.addActivity({
      type: 'service',
      title: `Service ${action}`,
      description: `"${serviceName}" service has been ${action.toLowerCase()}`,
      user: user,
      status: this.getStatusFromAction(action)
    });
  }

  trackTestimonialActivity(action: string, clientName: string, user: string): void {
    this.addActivity({
      type: 'testimonial',
      title: `Testimonial ${action}`,
      description: `Testimonial from ${clientName} has been ${action.toLowerCase()}`,
      user: user,
      status: this.getStatusFromAction(action)
    });
  }

  trackEnquiryActivity(action: string, enquiryDetails: string, user: string = 'System'): void {
    this.addActivity({
      type: 'enquiry',
      title: `Enquiry ${action}`,
      description: enquiryDetails,
      user: user,
      status: this.getStatusFromAction(action)
    });
  }

  private getStatusFromAction(action: string): string {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('create') || actionLower.includes('add') || actionLower.includes('publish')) {
      return 'new';
    } else if (actionLower.includes('update') || actionLower.includes('edit') || actionLower.includes('modify')) {
      return 'updated';
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'deleted';
    } else if (actionLower.includes('approve')) {
      return 'approved';
    } else if (actionLower.includes('reject')) {
      return 'rejected';
    } else {
      return 'pending';
    }
  }
}
