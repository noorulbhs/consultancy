import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminServiceService } from '../../../admin/services-manager/services/admin-service.service';

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
}

@Component({
  selector: 'app-servicesprovided',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];

  constructor(private serviceService: AdminServiceService) {}

  ngOnInit(): void {
    this.serviceService.getAll().subscribe((data: Service[]) => this.services = data);
  }
}
