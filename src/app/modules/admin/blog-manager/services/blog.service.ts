import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BLOG_DATA } from '../mock/blog-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogs = [...BLOG_DATA];

  constructor(private activityTracker: ActivityTrackerService) {}

  getAll(): Observable<any[]> {
    return of(this.blogs);
  }

  getById(id: number): Observable<any> {
    return of(this.blogs.find(b => b.id === id));
  }

  add(blog: any): Observable<any> {
    blog.id = Date.now();
    blog.date = new Date().toISOString().split('T')[0];
    this.blogs.push(blog);
    
    // Track activity
    const authorName = typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Admin';
    this.activityTracker.trackBlogActivity('Created', blog.title || 'New Blog Post', authorName);
    
    return of(blog);
  }

  update(id: number, updated: any): Observable<any> {
    const index = this.blogs.findIndex(b => b.id === id);
    if (index !== -1) {
      this.blogs[index] = { ...updated, id };
      
      // Track activity
      const authorName = typeof updated.author === 'string' ? updated.author : updated.author?.name || 'Admin';
      this.activityTracker.trackBlogActivity('Updated', updated.title || 'Blog Post', authorName);
    }
    return of(updated);
  }

  delete(id: number): Observable<any> {
    const blogToDelete = this.blogs.find(b => b.id === id);
    this.blogs = this.blogs.filter(b => b.id !== id);
    
    // Track activity
    if (blogToDelete) {
      const authorName = typeof blogToDelete.author === 'string' ? blogToDelete.author : blogToDelete.author?.name || 'Admin';
      this.activityTracker.trackBlogActivity('Deleted', blogToDelete.title || 'Blog Post', authorName);
    }
    
    return of({ success: true });
  }
}
