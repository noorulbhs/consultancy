import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  jobs: any[] = [];
  selectedJob: any = null;
  showJobModal = false;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getAll().subscribe(data => this.jobs = data);
  }

  getOpenJobs(): any[] {
    return this.jobs.filter(job => job.isOpen);
  }

  getTotalOpenings(): number {
    return this.jobs.reduce((total, job) => {
      return job.isOpen && job.openings ? total + job.openings : total;
    }, 0);
  }

  getUniqueDepartments(): string[] {
    const departments = [...new Set(this.jobs.map(job => job.department))];
    return departments;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  viewJobDetails(job: any): void {
    this.selectedJob = job;
    this.showJobModal = true;
  }

  closeJobModal(): void {
    this.showJobModal = false;
    this.selectedJob = null;
  }

  delete(id: number) {
    if (confirm('Delete this job posting?')) {
      this.jobService.delete(id).subscribe(() => {
        this.jobs = this.jobs.filter(j => j.id !== id);
      });
    }
  }

  toggleStatus(id: number) {
    this.jobService.toggleStatus(id).subscribe(() => {
      this.ngOnInit();
    });
  }
}
