// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// import { FooterService } from '../../services/footer.service';
// import { FeatureToggleService } from '../../../../admin/services/feature-toggle.service';

// @Component({
//   selector: 'app-footer',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MatIconModule],
//   templateUrl: './footer.component.html',
//   styleUrls: ['./footer.component.scss']
// })
// export class FooterComponent implements OnInit {
//   footerData: any;
//   filteredQuickLinks: any[] = [];

//   allQuickLinks = [
//     { path: '/home', label: 'Home' },
//     { path: '/services', label: 'Services' },
//     { path: '/about', label: 'About' },
//     { path: '/blog', label: 'Blog', featureId: 'navbar-blog' },
//     { path: '/careers', label: 'Careers', featureId: 'navbar-careers' },
//     { path: '/contact', label: 'Contact' }
//   ];

//   constructor(
//     private footerService: FooterService,
//     private featureToggleService: FeatureToggleService
//   ) {}

//   ngOnInit(): void {
//     this.featureToggleService.initializeFromStorage();
    
//     this.footerService.getFooterData().subscribe((data) => {
//       this.footerData = data;
//       this.updateQuickLinks();
//     });

//     // Subscribe to feature toggle changes
//     this.featureToggleService.getFeatures().subscribe(() => {
//       this.updateQuickLinks();
//     });
//   }

//   private updateQuickLinks(): void {
//     this.filteredQuickLinks = this.allQuickLinks.filter(link => {
//       if (link.featureId) {
//         return this.featureToggleService.isFeatureEnabled(link.featureId);
//       }
//       return true; // Always show links without feature toggle
//     });
    
//     // Update footer data with filtered links
//     if (this.footerData) {
//       this.footerData.quickLinks = this.filteredQuickLinks;
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FooterService } from './footer.service';
import { MatIconModule } from '@angular/material/icon'; 
import { FeatureToggleService } from '../../../featuretoggle.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule]
})
export class FooterComponent implements OnInit {
  footerData: any;
  featureToggles: { [id: string]: boolean } = {};

  constructor(
    private footerService: FooterService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit() {
    this.footerService.getFooterData().subscribe(data => {
      this.footerData = data;
      console.log('[Footer] footerData:', data);
    });
    this.featureToggleService.getFeatureToggles().subscribe(toggles => {
      this.featureToggles = toggles;
      console.log('[Footer] featureToggles:', toggles);
    });
  }
}