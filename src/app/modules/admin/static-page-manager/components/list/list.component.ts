import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticPageService } from '../../services/static-page.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaticPage } from '../../mock/static-content';
import { FilterPipe } from '../../pipes/filter.pipe';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-static-page-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterPipe],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class StaticPageListComponent implements OnInit {
  pages: StaticPage[] = [];
  filteredPages: StaticPage[] = [];
  selectedPage: StaticPage | null = null;
  showPreviewModal = false;
  
  // Filters and search
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  
  categories: string[] = [];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private service: StaticPageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.service.getAll().subscribe(pages => {
      this.pages = pages.map(page => ({
        ...page,
        lastUpdated: typeof page.lastUpdated === 'string' ? new Date(page.lastUpdated) : page.lastUpdated
      }));
      this.categories = [...new Set(pages.map(page => page.category))];
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.pages];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        page.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (page.keywords && page.keywords.some(keyword => 
          keyword.toLowerCase().includes(this.searchTerm.toLowerCase())
        ))
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(page => page.category === this.selectedCategory);
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(page => page.status === this.selectedStatus);
    }

    this.filteredPages = filtered;
    this.totalPages = Math.ceil(this.filteredPages.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
  }

  get paginatedPages(): StaticPage[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPages.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Search and filter methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Preview modal methods
  showPreview(page: StaticPage): void {
    this.selectedPage = page;
    this.showPreviewModal = true;
  }

  closePreview(): void {
    this.showPreviewModal = false;
    this.selectedPage = null;
  }

  // Delete method
  deletePage(page: StaticPage): void {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      this.service.delete(page.id).subscribe(response => {
        if (response.success !== false) {
          this.closePreview(); // Close modal before reloading
          this.notificationService.success('Page Deleted', 'Static page has been deleted successfully!');
          // Optimistically remove the page from the list for instant UI update
          this.pages = this.pages.filter(p => p.id !== page.id);
          this.applyFilters();
        } else {
          this.notificationService.error('Deletion Failed', `Error deleting page: ${response.message}`);
        }
      }, error => {
        this.notificationService.error('Deletion Failed', 'A network or server error occurred.');
      });
    }
  }

  // Utility methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-success';
      case 'draft': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'About Us': return 'bg-primary';
      case 'Home Page': return 'bg-info';
      case 'Contact': return 'bg-success';
      case 'Legal': return 'bg-warning';
      case 'Services': return 'bg-purple';
      default: return 'bg-secondary';
    }
  }

  getContentPreview(content: string): string {
    // Strip HTML tags and limit to 100 characters
    const strippedContent = content.replace(/<[^>]*>/g, '');
    return strippedContent.length > 100 ? strippedContent.substring(0, 100) + '...' : strippedContent;
  }

  getKeywordsDisplay(keywords: string[] | undefined): string {
    if (!keywords || keywords.length === 0) return 'No keywords';
    if (keywords.length <= 3) return keywords.join(', ');
    return keywords.slice(0, 3).join(', ') + ` +${keywords.length - 3} more`;
  }
}
