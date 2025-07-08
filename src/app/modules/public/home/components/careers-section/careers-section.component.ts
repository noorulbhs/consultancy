import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../../admin/job-manager/services/job.service';
import { FeatureToggleService } from '../../../../admin/services/feature-toggle.service';

@Component({
  selector: 'app-careers-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './careers-section.component.html',
  styleUrls: ['./careers-section.component.scss']
})
export class CareersSectionComponent implements OnInit {
  featuredJobs: any[] = [];
  totalJobs = 0;
  isVisible = false;

  constructor(
    private jobService: JobService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    // Check if this section should be visible
    this.featureToggleService.getFeatures().subscribe(() => {
      this.isVisible = this.featureToggleService.isFeatureEnabled('careers-section');
      if (this.isVisible) {
        this.loadJobs();
      }
    });
  }

  private loadJobs(): void {
    this.jobService.getAll().subscribe((jobs: any[]) => {
      // Get active jobs
      const activeJobs = jobs.filter(job => job.status === 'active');
      this.totalJobs = activeJobs.length;
      
      // Get featured or latest 3 jobs
      const featured = activeJobs.filter(job => job.featured);
      if (featured.length >= 3) {
        this.featuredJobs = featured.slice(0, 3);
      } else {
        this.featuredJobs = [
          ...featured,
          ...activeJobs.filter(job => !job.featured).slice(0, 3 - featured.length)
        ];
      }
    });
  }

  formatSalary(job: any): string {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      return `From $${job.salaryMin.toLocaleString()}`;
    } else if (job.salaryMax) {
      return `Up to $${job.salaryMax.toLocaleString()}`;
    }
    return 'Competitive Salary';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  getExcerpt(description: string): string {
    if (!description) return '';
    const plainText = description.replace(/<[^>]*>/g, '');
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  }

  showCareersNavigation(): boolean {
    return this.featureToggleService.isFeatureEnabled('navbar-careers');
  }
}
