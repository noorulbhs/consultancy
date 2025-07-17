import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminServiceService } from '../../admin/services-manager/services/admin-service.service';

interface Service {
  id: number;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  icon: string;
  features: string[];
  technologies: string[];
  duration: string;
  deliverables: string[];
  caseStudy: {
    client: string;
    challenge: string;
    solution: string;
    results: string;
  };
  featured: boolean;
  status: string;
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  selectedCategory: string = 'all';
  selectedService: Service | null = null;
  isCaseStudyVisible: boolean = false;

  constructor(
    private serviceService: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serviceService.getAllPublic().subscribe((data: any[]) => {
      // Map backend fields to frontend Service interface
      this.services = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        detailedDescription: item.detailedDescription,
        category: item.category,
        icon: item.icon?.replace('fas fa-', '') || 'cog',
        features: item.features || [],
        technologies: item.technologies || [],
        duration: item.duration,
        deliverables: item.deliverables || [],
        caseStudy: {
          client: item.caseStudyClient || '',
          challenge: item.caseStudyChallenge || '',
          solution: item.caseStudySolution || '',
          results: item.caseStudyResults || ''
        },
        featured: !!item.featured,
        status: item.status,
        imageUrl: item.imageUrl || '',
        sortOrder: item.sortOrder || 0
      }));
      // Keep filteredServices in sync with services and current filter
      this.filterByCategory(this.selectedCategory);
    });
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.services.map(service => service.category))];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter(service => service.category === category);
    }
  }

  openServiceModal(service: Service): void {
    this.selectedService = service;
    if(this.selectedService?.caseStudy.client.length > 0) {
      this.isCaseStudyVisible = true;
    }
    const modal = new (window as any).bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
