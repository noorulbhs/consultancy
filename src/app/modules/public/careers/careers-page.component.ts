import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../admin/job-manager/services/job.service';
import { NotificationService } from '../../../core/services/notification.service';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience?: string;
  salary?: string;
  remoteWork?: string;
  openings?: number;
  description: string;
  skills?: string[];
  benefits?: string[];
  isOpen: boolean;
}

@Component({
  selector: 'app-careers-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './careers-page.component.html',
  styleUrls: ['./careers-page.component.scss']
})
export class CareersPageComponent implements OnInit {
  jobs: Job[] = [];
  selectedJob: Job | null = null;
  showJobModal = false;
  
  get openJobs(): Job[] {
    return this.jobs.filter(job => job.isOpen);
  }

  constructor(
    private jobService: JobService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  private loadJobs() {
    this.jobService.getAll().subscribe((data: Job[]) => {
      this.jobs = data;
    });
  }

  getJobExcerpt(description: string): string {
    // Remove HTML tags and get first 100 characters
    const textContent = description.replace(/<[^>]*>/g, '');
    return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
  }

  viewJobDetails(job: Job): void {
    this.selectedJob = job;
    this.showJobModal = true;
  }

  closeJobModal(): void {
    this.showJobModal = false;
    this.selectedJob = null;
  }

  applyForJob(job: Job): void {
    // In a real application, this would navigate to an application form
    this.notificationService.info('Application Form', `This would open the application form for ${job.title}. Feature coming soon!`);
  }
}
