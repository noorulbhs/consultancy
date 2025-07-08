import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../admin/blog-manager/services/blog.service';

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
}

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss']
})
export class BlogPageComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  featuredPosts: BlogPost[] = [];
  selectedBlog: BlogPost | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  private loadBlogPosts() {
    this.blogService.getAll().subscribe((data: BlogPost[]) => {
      this.blogPosts = data;
      this.featuredPosts = data.filter(post => post.featured);
    });
  }

  openBlogModal(blog: BlogPost) {
    this.selectedBlog = blog;
    // Using Bootstrap modal
    const modal = new (window as any).bootstrap.Modal(document.getElementById('blogModal'));
    modal.show();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getExcerpt(content: string): string {
    // Remove HTML tags and get first 150 characters
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;
  }
}
