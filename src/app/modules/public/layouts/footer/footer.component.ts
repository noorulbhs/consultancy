import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../../admin/site-settings/services/settings.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FeatureToggleService } from '../../../admin/services/feature-toggle.service';

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
  filteredCompanyLinks: any[] = [];

  defaultCompanyLinks = [
    { url: '/about', title: 'About Us' },
    { url: '/blog', title: 'Blog', featureId: 'navbar-blog' },
    { url: '/careers', title: 'Careers', featureId: 'navbar-careers' },
    { url: '/contact', title: 'Contact Us' }
  ];

  constructor(
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    this.loadFooterData();
    // Subscribe to feature toggle changes
    this.featureToggleService.getFeatures().subscribe(() => {
      this.updateCompanyLinks();
    });
  }

  private loadFooterData(): void {
    this.settingsService.getSettingsForFooter().subscribe(data => {
      this.footerData = data;
      this.updateCompanyLinks();
    });
  }

  private updateCompanyLinks(): void {
    this.filteredCompanyLinks = this.defaultCompanyLinks.filter(link => {
      if (link.featureId) {
        return this.featureToggleService.isFeatureEnabled(link.featureId);
      }
      return true; // Always show links without feature toggle
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
