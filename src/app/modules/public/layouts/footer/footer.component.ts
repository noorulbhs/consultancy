// ...existing code...
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../../admin/site-settings/services/settings.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FeatureToggleService } from '../../../public/featuretoggle.service';
import { StaticPageService } from '../../../admin/static-page-manager/services/static-page.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  policyModalTitle = '';
  policyModalContent = '';
  openPolicyModal(type: 'privacy' | 'terms'): void {
    if (type === 'privacy') {
      this.policyModalTitle = 'Privacy Policy';
      this.policyModalContent = this.privacyPolicyContent;
    } else {
      this.policyModalTitle = 'Terms of Service';
      this.policyModalContent = this.termsOfServiceContent;
    }
    const modal = document.getElementById('policyModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }
  footerData: any = {};
  currentYear = new Date().getFullYear();
  filteredCompanyLinks: any[] = [];
  privacyPolicyContent: string = '';
  termsOfServiceContent: string = '';

  defaultCompanyLinks = [
    { url: '/about', title: 'About Us' },
    { url: '/blog', title: 'Blog', featureId: 'navbar-blog' },
    { url: '/careers', title: 'Careers', featureId: 'navbar-career' },
    { url: '/contact', title: 'Contact Us' }
  ];

  constructor(
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private featureToggleService: FeatureToggleService,
    private staticPageService: StaticPageService
  ) {}

  ngOnInit(): void {
    this.loadFooterData();
    // Subscribe to feature toggle changes
    this.featureToggleService.getFeatureToggles().subscribe((features: any) => {
      this.updateCompanyLinks();
    });
    // Fetch static page content for privacy policy and terms of service
    this.staticPageService.getContent('privacy-policy').subscribe((res: any) => {
      this.privacyPolicyContent = res || '';
    });
    this.staticPageService.getContent('terms-of-service').subscribe((res: any) => {
      this.termsOfServiceContent = res || '';
    });
  }

  private loadFooterData(): void {
    this.settingsService.getSettingsForFooter().subscribe(data => {
      this.footerData = data;
      // console.log('[Footer/layouts] footerData:', data);
      this.updateCompanyLinks();
    });
  }

  private updateCompanyLinks(): void {
    // Get the latest toggles synchronously from the service
    const toggles = this.featureToggleService.latestToggles || {};
    this.filteredCompanyLinks = this.defaultCompanyLinks.filter(link => {
      if (link.featureId) {
        const enabled = toggles[link.featureId];
        // console.log(`[Footer/layouts] Checking featureId '${link.featureId}':`, enabled);
        return enabled;
      }
      return true; // Always show links without feature toggle
    });
    // console.log('[Footer/layouts] filteredCompanyLinks:', this.filteredCompanyLinks);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  subscribeNewsletter(email: string): void {
    if (email && this.isValidEmail(email)) {
      // In a real application, you would send this to your newsletter service
      // console.log('Newsletter subscription for:', email);
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
