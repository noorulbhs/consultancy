import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../../admin/site-settings/services/settings.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerData: any = {};
  currentYear = new Date().getFullYear();

  constructor(
    private settingsService: SettingsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadFooterData();
  }

  private loadFooterData(): void {
    this.settingsService.getSettingsForFooter().subscribe(data => {
      this.footerData = data;
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  subscribeNewsletter(email: string): void {
    if (email && this.isValidEmail(email)) {
      // In a real application, you would send this to your newsletter service
      console.log('Newsletter subscription for:', email);
      this.notificationService.success('Newsletter Subscription', 'Thank you for subscribing to our newsletter!');
    } else {
      this.notificationService.error('Invalid Email', 'Please enter a valid email address.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
