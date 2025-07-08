import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FooterService } from '../../services/footer.service';
import { FeatureToggleService } from '../../../../admin/services/feature-toggle.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerData: any;
  filteredQuickLinks: any[] = [];

  allQuickLinks = [
    { path: '/home', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog', featureId: 'navbar-blog' },
    { path: '/careers', label: 'Careers', featureId: 'navbar-careers' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor(
    private footerService: FooterService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    this.featureToggleService.initializeFromStorage();
    
    this.footerService.getFooterData().subscribe((data) => {
      this.footerData = data;
      this.updateQuickLinks();
    });

    // Subscribe to feature toggle changes
    this.featureToggleService.getFeatures().subscribe(() => {
      this.updateQuickLinks();
    });
  }

  private updateQuickLinks(): void {
    this.filteredQuickLinks = this.allQuickLinks.filter(link => {
      if (link.featureId) {
        return this.featureToggleService.isFeatureEnabled(link.featureId);
      }
      return true; // Always show links without feature toggle
    });
    
    // Update footer data with filtered links
    if (this.footerData) {
      this.footerData.quickLinks = this.filteredQuickLinks;
    }
  }
}
