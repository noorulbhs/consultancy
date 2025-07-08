import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngIf="currentNotification"
        class="notification-toast"
        [class]="'notification-' + currentNotification.type"
        [@slideIn]
      >
        <div class="notification-content">
          <div class="notification-icon">
            <i [class]="getIconClass(currentNotification.type)"></i>
          </div>
          <div class="notification-message">
            <h4 class="notification-title">{{ currentNotification.title }}</h4>
            <p class="notification-text">{{ currentNotification.message }}</p>
          </div>
          <button class="notification-close" (click)="closeNotification()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      pointer-events: none;
    }

    .notification-toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 12px;
      overflow: hidden;
      pointer-events: auto;
      border-left: 4px solid;
    }

    .notification-success {
      border-left-color: #10b981;
    }

    .notification-error {
      border-left-color: #ef4444;
    }

    .notification-warning {
      border-left-color: #f59e0b;
    }

    .notification-info {
      border-left-color: #3b82f6;
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      gap: 12px;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 12px;
    }

    .notification-success .notification-icon {
      background: #d1fae5;
      color: #10b981;
    }

    .notification-error .notification-icon {
      background: #fee2e2;
      color: #ef4444;
    }

    .notification-warning .notification-icon {
      background: #fef3c7;
      color: #f59e0b;
    }

    .notification-info .notification-icon {
      background: #dbeafe;
      color: #3b82f6;
    }

    .notification-message {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      font-size: 14px;
      color: #111827;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }

    .notification-text {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.4;
      margin: 0;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .notification-close {
      flex-shrink: 0;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .notification-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    @media (max-width: 480px) {
      .notification-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', [
        style({
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate('300ms ease-in', style({
          transform: 'translateX(100%)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class NotificationToastComponent implements OnInit, OnDestroy {
  currentNotification: Notification | null = null;
  private subscription: Subscription = new Subscription();
  private autoCloseTimeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      notification => {
        this.currentNotification = notification;
        
        if (notification) {
          // Auto-close after 5 seconds for success/info notifications
          if (notification.type === 'success' || notification.type === 'info') {
            this.setAutoClose(5000);
          } else if (notification.type === 'warning') {
            this.setAutoClose(8000);
          }
          // Error notifications don't auto-close, user must manually dismiss
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  }

  private setAutoClose(delay: number): void {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
    this.autoCloseTimeout = setTimeout(() => {
      this.closeNotification();
    }, delay);
  }

  closeNotification(): void {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
    this.notificationService.clear();
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  }
}
