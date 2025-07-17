import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { RouterModule } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  readingTime: string;
  views: number;
  featured: boolean;
  featuredImage: string;
  content: string;
  publishedAt: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  sortOrder: number;
}

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  blogs: BlogPost[] = [];
  selectedBlog: BlogPost | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getAll().subscribe(data => this.blogs = data);
  }

  delete(id: number) {
    if (confirm('Delete this blog?')) {
      this.blogService.delete(id).subscribe(() => {
        this.blogs = this.blogs.filter(b => b.id !== id);
      });
    }
  }

  openBlogModal(blog: BlogPost) {
    this.selectedBlog = blog;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('blogModal'));
    modal.show();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getFeaturedCount(): number {
    return this.blogs.filter(blog => blog.featured).length;
  }

  getTotalViews(): number {
    return this.blogs.reduce((total, blog) => total + blog.views, 0);
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.blogs.map(blog => blog.category))];
  }
}
