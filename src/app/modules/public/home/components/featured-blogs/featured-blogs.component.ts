import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService, BlogPost } from '../../../../admin/blog-manager/services/blog.service';
import { FeatureToggleService } from '../../../../admin/services/feature-toggle.service';

@Component({
  selector: 'app-featured-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-blogs.component.html',
  styleUrls: ['./featured-blogs.component.scss']
})
export class FeaturedBlogsComponent implements OnInit {
  featuredBlogs: BlogPost[] = [];
  isVisible = false;

  constructor(
    private blogService: BlogService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    // Check if this section should be visible
    this.featureToggleService.getFeatures().subscribe(() => {
      this.isVisible = this.featureToggleService.isFeatureEnabled('featured-blogs-section');
      if (this.isVisible) {
        this.loadBlogs();
      }
    });
  }

  private loadBlogs(): void {
    this.blogService.getAll().subscribe((blogs: BlogPost[]) => {
      // Get published blogs, prioritize featured ones
      const publishedBlogs = blogs.filter(blog => blog.published);
      const featured = publishedBlogs.filter(blog => blog.featured);
      
      if (featured.length >= 3) {
        this.featuredBlogs = featured.slice(0, 3);
      } else {
        // If not enough featured blogs, fill with latest published ones
        this.featuredBlogs = [
          ...featured,
          ...publishedBlogs.filter(blog => !blog.featured).slice(0, 3 - featured.length)
        ];
      }
    });
  }

  getExcerpt(content: string): string {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
