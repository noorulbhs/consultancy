import { downloadDataAsPdf } from '../../../core/utils/pdf.util';
  // showAllDocumentsModal = false;
  // openAllDocumentsModal(): void {
  //   this.showAllDocumentsModal = true;
  // }

  // closeAllDocumentsModal(): void {
  //   this.showAllDocumentsModal = false;
  // }

  // copyAllDocumentsToClipboard(): void {
  //   if (this.allDocuments) {
  //     const text = JSON.stringify(this.allDocuments, null, 2);
  //     navigator.clipboard.writeText(text);
  //   }
  // }

  // downloadAllDocumentsAsPDF(): void {
  //   if (this.allDocuments) {
  //     downloadDataAsPdf(this.allDocuments, 'all-documents');
  //   }
  // }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { AllDocument } from '../../../core/interfaces/all-document.interface';
import { DashboardMetricsResponse } from '../services/dashboard-backend.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard-clean.component.scss',
    './dashboard-enhanced.component.scss',
    './dashboard-new.component.scss',
  ],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  showAllDocumentsModal = false;

  openAllDocumentsModal(): void {
    this.dashboardService.getAllDocuments().subscribe((docs) => {
      this.allDocuments = docs;
    });
    this.showAllDocumentsModal = true;
  }

  closeAllDocumentsModal(): void {
    this.showAllDocumentsModal = false;
  }

  copyAllDocumentsToClipboard(): void {
    if (this.allDocuments) {
      const text = JSON.stringify(this.allDocuments, null, 2);
      navigator.clipboard.writeText(text);
    }
  }

  downloadAllDocumentsAsPDF(): void {
    if (this.allDocuments) {
      downloadDataAsPdf(this.allDocuments, 'all-documents');
    }
  }
  stats: DashboardMetricsResponse['stats'] = [];
  quickActions: any[] = [];
  ongoingProjects: any[] = [];
  allDocuments: AllDocument | null = null;

  currentTime: Date = new Date();

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardMetrics().subscribe((metrics) => {
      this.stats = metrics.stats;
    });
    this.dashboardService.getQuickActions().subscribe((actions) => {
      this.quickActions = actions;
    });
    this.dashboardService.getOngoingProjects().subscribe((projects) => {
      this.ongoingProjects = projects;
    });

    // Fetch all dashboard documents
    this.dashboardService.getAllDocuments().subscribe((docs) => {
      this.allDocuments = docs;
    });

    // Start clock for currentTime
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  trackByIndex(index: number): number {
    return index;
  }

  navigateToRoute(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  formatStatValue(value: number): string {
    return value.toLocaleString();
  }

  getGradientBackground(color: string): string {
    return `linear-gradient(135deg, ${color} 0%, #fff 100%)`;
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/admin/project-manager', projectId]);
  }

  getProjectStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'on hold':
        return 'status-on-hold';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  getProjectStatusIcon(status: string): string {
    switch (status) {
      case 'active':
        return 'fas fa-play';
      case 'on hold':
        return 'fas fa-pause';
      case 'completed':
        return 'fas fa-check';
      default:
        return 'fas fa-question';
    }
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 80) {
      return 'progress-bar-success';
    } else if (progress >= 50) {
      return 'progress-bar-warning';
    } else {
      return 'progress-bar-danger';
    }
  }

  formatDaysUntilDeadline(deadline: string): string {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 1) {
      return `${diff} days left`;
    } else if (diff === 1) {
      return '1 day left';
    } else if (diff === 0) {
      return 'Due today';
    } else {
      return 'Overdue';
    }
  }
}
