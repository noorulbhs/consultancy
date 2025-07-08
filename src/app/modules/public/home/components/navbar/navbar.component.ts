import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FeatureToggleService } from '../../../../admin/services/feature-toggle.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' }
  ];
  
  allNavLinks = [
    { path: '/home', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About Us' },
    { path: '/blog', label: 'Blog', featureId: 'navbar-blog' },
    { path: '/careers', label: 'Careers', featureId: 'navbar-careers' },
    { path: '/contact', label: 'Contact Us' }
  ];

  constructor(private featureToggleService: FeatureToggleService) {}

  ngOnInit(): void {
    this.featureToggleService.initializeFromStorage();
    this.updateNavLinks();
    
    // Subscribe to feature toggle changes
    this.featureToggleService.getFeatures().subscribe(() => {
      this.updateNavLinks();
    });
  }

  private updateNavLinks(): void {
    this.navLinks = this.allNavLinks.filter(link => {
      if (link.featureId) {
        return this.featureToggleService.isFeatureEnabled(link.featureId);
      }
      return true; // Always show links without feature toggle
    });
  }

  toggleMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
