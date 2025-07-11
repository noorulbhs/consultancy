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

  constructor(
    private serviceService: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serviceService.getAll().subscribe((data: Service[]) => {
      this.services = data;
      this.filteredServices = data;
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
    const modal = new (window as any).bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
