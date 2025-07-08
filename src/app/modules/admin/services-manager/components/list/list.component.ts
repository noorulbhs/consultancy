import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminServiceService } from '../../services/admin-service.service';
import { RouterModule } from '@angular/router';

interface Service {
  id: number;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  icon: string;
  features: string[];
  technologies: string[];
  price: string;
  duration: string;
  deliverables: string[];
  clientTypes: string[];
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
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  services: Service[] = [];
  selectedService: Service | null = null;

  constructor(private service: AdminServiceService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.services = data);
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.service.delete(id).subscribe(() => {
        this.services = this.services.filter(s => s.id !== id);
      });
    }
  }

  openServiceModal(service: Service): void {
    this.selectedService = service;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
  }

  getFeaturedCount(): number {
    return this.services.filter(service => service.featured).length;
  }

  getActiveCount(): number {
    return this.services.filter(service => service.status === 'active').length;
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.services.map(service => service.category))];
  }
}
