import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { Project, ProjectStatus, ProjectPriority, ProjectFilters, ProjectSummary } from '../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  projectSummary: ProjectSummary | null = null;
  loading = false;
  error: string | null = null;

  // Filter properties
  filters: ProjectFilters = {};
  statusOptions = Object.values(ProjectStatus);
  priorityOptions = Object.values(ProjectPriority);
  
  // Search and pagination
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortField = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // View options
  viewMode: 'grid' | 'list' = 'list';

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadProjectSummary();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    this.projectService.getProjects(this.filters).subscribe({
      next: (response) => {
        // If response is paginated, extract .data or fallback to []
        this.projects = Array.isArray(response?.data) ? response.data : [];
        this.applyFiltersAndSearch();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load projects';
        this.loading = false;
        console.error('Error loading projects:', error);
      }
    });
  }

  loadProjectSummary(): void {
    this.projectService.getProjectSummary().subscribe({
      next: (res: any) => {
        // Accepts both { data: ... } and direct object
        this.projectSummary = res && (res.data || res);
      },
      error: (error) => {
        console.error('Error loading project summary:', error);
      }
    });
  }

  applyFiltersAndSearch(): void {
    let filtered = [...this.projects];

    // Apply search
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term) ||
        project.clientName.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.projectManager.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'startDate':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'endDate':
          aValue = new Date(a.endDate);
          bValue = new Date(b.endDate);
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'budget':
          aValue = a.estimatedBudget;
          bValue = b.estimatedBudget;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredProjects = filtered;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFiltersAndSearch();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProjects();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSearch();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'fas fa-sort';
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  getPaginatedProjects(): Project[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProjects.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  addNewProject(): void {
    this.router.navigate(['/admin-projects/new']);
  }

  editProject(id: string): void {
    this.router.navigate(['/admin-projects/edit', id]);
  }

  viewProject(id: string): void {
    this.router.navigate(['/admin-projects/view', id]);
  }

  deleteProject(project: Project): void {
    if (!project.id) return;

    const confirmed = confirm(`Are you sure you want to delete the project "${project.name}"?`);
    if (!confirmed) return;

    this.projectService.deleteProject(project.id).subscribe({
      next: (success) => {
        if (success) {
          this.loadProjects();
          this.loadProjectSummary();
        }
      },
      error: (error) => {
        this.error = 'Failed to delete project';
        console.error('Error deleting project:', error);
      }
    });
  }

  getStatusBadgeClass(status: ProjectStatus): string {
    const classes: { [key in ProjectStatus]: string } = {
      [ProjectStatus.PLANNING]: 'badge bg-secondary',
      [ProjectStatus.ACTIVE]: 'badge bg-primary',
      [ProjectStatus.ON_HOLD]: 'badge bg-warning',
      [ProjectStatus.COMPLETED]: 'badge bg-success',
      [ProjectStatus.CANCELLED]: 'badge bg-danger',
      [ProjectStatus.REVIEW]: 'badge bg-info'
    };
    return classes[status];
  }

  getPriorityBadgeClass(priority: ProjectPriority): string {
    const classes: { [key in ProjectPriority]: string } = {
      [ProjectPriority.LOW]: 'badge bg-light text-dark',
      [ProjectPriority.MEDIUM]: 'badge bg-info',
      [ProjectPriority.HIGH]: 'badge bg-warning',
      [ProjectPriority.CRITICAL]: 'badge bg-danger'
    };
    return classes[priority];
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-info';
    if (progress >= 40) return 'bg-warning';
    return 'bg-danger';
  }

  formatCurrency(amount: number): string {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(safeAmount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysRemaining(endDate: Date): number {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(endDate: Date): boolean {
    return new Date(endDate) < new Date();
  }

  clearFilters(): void {
    this.filters = {};
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadProjects();
  }

  exportProjects(): void {
    // Implement export functionality
    console.log('Export projects functionality to be implemented');
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getDisplayedItemsCount(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProjects.length);
  }
}
