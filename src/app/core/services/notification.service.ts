import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isVisible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$ = this.notificationSubject.asObservable();
  private currentNotificationId: string | null = null;

  constructor() {}

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private showNotification(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string): string {
    const id = this.generateId();
    this.currentNotificationId = id;
    
    const notification: Notification = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
      isVisible: true
    };

    this.notificationSubject.next(notification);
    return id;
  }

  success(title: string, message: string): string {
    return this.showNotification('success', title, message);
  }

  error(title: string, message: string): string {
    return this.showNotification('error', title, message);
  }

  warning(title: string, message: string): string {
    return this.showNotification('warning', title, message);
  }

  info(title: string, message: string): string {
    return this.showNotification('info', title, message);
  }

  dismiss(notificationId?: string): void {
    if (!notificationId || notificationId === this.currentNotificationId) {
      this.notificationSubject.next(null);
      this.currentNotificationId = null;
    }
  }

  clear(): void {
    this.notificationSubject.next(null);
    this.currentNotificationId = null;
  }
}
