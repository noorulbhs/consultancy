import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FeatureToggleService } from '../../../featuretoggle.service';

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
    { path: '/careers', label: 'Careers', featureId: 'navbar-career' },
    { path: '/contact', label: 'Contact Us' }
  ];

  constructor(private featureToggleService: FeatureToggleService) {}

  ngOnInit(): void {
    this.updateNavLinks();
    this.featureToggleService.getFeatureToggles().subscribe(() => {
      this.updateNavLinks();
    });
  }

  private updateNavLinks(): void {
    const toggles = this.featureToggleService.latestToggles || {};
    this.navLinks = this.allNavLinks.filter(link => {
      if (link.featureId) {
        return toggles[link.featureId];
      }
      return true;
    });
  }

  toggleMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
