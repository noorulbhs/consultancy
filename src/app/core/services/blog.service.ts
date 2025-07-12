import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BlogPost } from '../interfaces/content.interface';
import { HttpService } from './http.service';
import { DataSourceService } from './data-source.service';
import { PUBLIC_API_ENDPOINTS, ADMIN_API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private mockBlogs: BlogPost[] = [
    {
      id: 1,
      title: 'The Future of Cloud Computing',
      slug: 'future-of-cloud-computing',
      summary: 'Exploring emerging trends in cloud technology and their impact on business.',
      excerpt: 'Cloud computing continues to evolve at a rapid pace, bringing new opportunities and challenges for businesses worldwide.',
      content: '<p>Cloud computing has transformed the way businesses operate, offering scalability, cost-efficiency, and flexibility. As we look ahead, several emerging trends are set to shape the future of cloud technology...</p>',
      author: {
        name: 'John Smith',
        title: 'Cloud Architect',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
        bio: 'Expert in cloud technologies with 10+ years of experience'
      },
      category: 'Cloud Computing',
      tags: ['cloud', 'technology', 'future', 'trends'],
      readingTime: '5 min read',
      views: 1250,
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&auto=format',
      publishedAt: '2024-01-15T10:30:00Z',
      status: 'published'
    },
    {
      id: 2,
      title: 'DevOps Best Practices for Modern Applications',
      slug: 'devops-best-practices',
      summary: 'A comprehensive guide to implementing DevOps practices in your development workflow.',
      excerpt: 'DevOps has become essential for modern software development, enabling faster deployments and improved collaboration.',
      content: '<p>DevOps represents a cultural shift that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle...</p>',
      author: {
        name: 'Sarah Johnson',
        title: 'DevOps Engineer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b375?w=150&h=150&fit=crop&crop=face&auto=format',
        bio: 'DevOps specialist with expertise in CI/CD and automation'
      },
      category: 'DevOps',
      tags: ['devops', 'automation', 'ci-cd', 'best-practices'],
      readingTime: '8 min read',
      views: 890,
      featured: false,
      featuredImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=400&fit=crop&auto=format',
      publishedAt: '2024-01-12T14:20:00Z',
      status: 'published'
    }
  ];

  constructor(
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {}

  // Get all published blog posts (public)
  getAllBlogs(): Observable<BlogPost[]> {
    if (this.dataSourceService.shouldUseRealData('blog')) {
      return this.getBlogsFromAPI();
    } else {
      return this.getBlogsFromMock();
    }
  }

  private getBlogsFromAPI(): Observable<BlogPost[]> {
    return this.httpService.get<BlogPost[]>(
      PUBLIC_API_ENDPOINTS.BLOGS,
      { isPublic: true }
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching blogs from API, falling back to mock data:', error);
        return this.getBlogsFromMock();
      })
    );
  }

  private getBlogsFromMock(): Observable<BlogPost[]> {
    return of(this.mockBlogs.filter(blog => blog.status === 'published'));
  }

  // Get blog by ID (public)
  getBlogById(id: number): Observable<BlogPost | undefined> {
    if (this.dataSourceService.shouldUseRealData('blog')) {
      return this.httpService.get<BlogPost>(
        PUBLIC_API_ENDPOINTS.BLOG_BY_ID(id),
        { isPublic: true }
      ).pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching blog from API:', error);
          return of(undefined);
        })
      );
    } else {
      return of(this.mockBlogs.find(blog => blog.id === id && blog.status === 'published'));
    }
  }

  // Get blog by slug (public)
  getBlogBySlug(slug: string): Observable<BlogPost | undefined> {
    if (this.dataSourceService.shouldUseRealData('blog')) {
      return this.httpService.get<BlogPost>(
        PUBLIC_API_ENDPOINTS.BLOG_BY_SLUG(slug),
        { isPublic: true }
      ).pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching blog from API:', error);
          return of(undefined);
        })
      );
    } else {
      return of(this.mockBlogs.find(blog => blog.slug === slug && blog.status === 'published'));
    }
  }

  // Get featured blogs (public)
  getFeaturedBlogs(): Observable<BlogPost[]> {
    return this.getAllBlogs().pipe(
      map(blogs => blogs.filter(blog => blog.featured))
    );
  }

  // Get blogs by category (public)
  getBlogsByCategory(category: string): Observable<BlogPost[]> {
    return this.getAllBlogs().pipe(
      map(blogs => blogs.filter(blog => blog.category.toLowerCase() === category.toLowerCase()))
    );
  }

  // Get blogs by tag (public)
  getBlogsByTag(tag: string): Observable<BlogPost[]> {
    return this.getAllBlogs().pipe(
      map(blogs => blogs.filter(blog => blog.tags.includes(tag.toLowerCase())))
    );
  }

  // Admin functions
  getAllBlogsForAdmin(): Observable<BlogPost[]> {
    if (this.dataSourceService.shouldUseRealData('blog')) {
      return this.httpService.get<BlogPost[]>(
        ADMIN_API_ENDPOINTS.BLOGS,
        { isPublic: false }
      ).pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching blogs for admin:', error);
          return of(this.mockBlogs);
        })
      );
    } else {
      return of(this.mockBlogs);
    }
  }

  createBlog(blog: Partial<BlogPost>): Observable<{ success: boolean; message: string; data?: any }> {
    if (this.dataSourceService.shouldUseRealData('blog')) {
      return this.httpService.post(
        ADMIN_API_ENDPOINTS.BLOGS,
        blog,
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Blog post created successfully', data: response.data })),
        catchError(error => {
          console.error('Error creating blog:', error);
          return of({ success: false, message: 'Failed to create blog post' });
        })
      );
    } else {
      const newBlog = {
        ...blog,
        id: Date.now(),
        publishedAt: new Date().toISOString(),
        views: 0
      };
      this.mockBlogs.push(newBlog as BlogPost);
      return of({ success: true, message: 'Blog post created successfully', data: newBlog });
    }
  }

  updateBlog(id: number, blog: Partial<BlogPost>): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('blog')) {
      return this.httpService.put(
        ADMIN_API_ENDPOINTS.BLOG_BY_ID(id),
        blog,
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Blog post updated successfully' })),
        catchError(error => {
          console.error('Error updating blog:', error);
          return of({ success: false, message: 'Failed to update blog post' });
        })
      );
    } else {
      const index = this.mockBlogs.findIndex(b => b.id === id);
      if (index !== -1) {
        this.mockBlogs[index] = { ...this.mockBlogs[index], ...blog };
        return of({ success: true, message: 'Blog post updated successfully' });
      }
      return of({ success: false, message: 'Blog post not found' });
    }
  }

  deleteBlog(id: number): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('blog')) {
      return this.httpService.delete(
        ADMIN_API_ENDPOINTS.BLOG_BY_ID(id),
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Blog post deleted successfully' })),
        catchError(error => {
          console.error('Error deleting blog:', error);
          return of({ success: false, message: 'Failed to delete blog post' });
        })
      );
    } else {
      const index = this.mockBlogs.findIndex(b => b.id === id);
      if (index !== -1) {
        this.mockBlogs.splice(index, 1);
        return of({ success: true, message: 'Blog post deleted successfully' });
      }
      return of({ success: false, message: 'Blog post not found' });
    }
  }

  // Get blog categories
  getBlogCategories(): Observable<string[]> {
    return this.getAllBlogs().pipe(
      map(blogs => {
        const categories = blogs.map(blog => blog.category);
        return Array.from(new Set(categories));
      })
    );
  }

  // Get blog tags
  getBlogTags(): Observable<string[]> {
    return this.getAllBlogs().pipe(
      map(blogs => {
        const tags = blogs.flatMap(blog => blog.tags);
        return Array.from(new Set(tags));
      })
    );
  }

  // Search blogs
  searchBlogs(query: string): Observable<BlogPost[]> {
    return this.getAllBlogs().pipe(
      map(blogs => blogs.filter(blog => 
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.content.toLowerCase().includes(query.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ))
    );
  }
}
