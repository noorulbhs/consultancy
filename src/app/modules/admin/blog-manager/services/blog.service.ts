import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { buildApiUrl, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogsUrl = ADMIN_API_ENDPOINTS.BLOGS;

  constructor(
    private http: HttpService,
    private activityTracker: ActivityTrackerService
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(this.blogsUrl).pipe(
      map(res => {
        if (res.data && Array.isArray(res.data.content)) {
          return res.data.content.map((blog: any) => ({
            ...blog,
            author: {
              name: blog.authorName || (blog.author && blog.author.name) || 'Unknown',
              title: blog.authorTitle || (blog.author && blog.author.title) || '',
              avatar: blog.authorAvatar || (blog.author && blog.author.avatar) || 'assets/images/default-avatar.png',
              bio: blog.authorBio || (blog.author && blog.author.bio) || ''
            }
          }));
        }
        return [];
      })
    );
  }

  getById(id: number): Observable<any> {
    const endpoint = ADMIN_API_ENDPOINTS.BLOG_BY_ID(id);
    return this.http.get<any>(endpoint).pipe(
      map(res => res.data!)
    );
  }

  add(blog: any): Observable<any> {
    // Track activity
    const authorName = typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Admin';
    this.activityTracker.trackBlogActivity('Created', blog.title || 'New Blog Post', authorName);
    return this.http.post<any>(this.blogsUrl, blog).pipe(
      map(res => res.data!)
    );
  }

  update(id: number, updated: any): Observable<any> {
    // Track activity (optional, can be moved to backend)
    const authorName = typeof updated.author === 'string' ? updated.author : updated.author?.name || 'Admin';
    this.activityTracker.trackBlogActivity('Updated', updated.title || 'Blog Post', authorName);
    const endpoint = ADMIN_API_ENDPOINTS.BLOG_BY_ID(id);
    return this.http.put<any>(endpoint, updated).pipe(
      map(res => res.data!)
    );
  }

  delete(id: number): Observable<any> {
    // Track activity (optional, can be moved to backend)
    // Note: You may want to fetch the blog first if you need author/title for activity
    const endpoint = ADMIN_API_ENDPOINTS.BLOG_BY_ID(id);
    this.activityTracker.trackBlogActivity('Deleted', 'Blog Post', 'Admin');
    return this.http.delete<any>(endpoint).pipe(
      map(res => res.data!)
    );
  }
}
