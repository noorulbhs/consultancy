import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private httpService: HttpService) {}

  getAll(): Observable<any[]> {
    return this.httpService.get<any[]>(ADMIN_API_ENDPOINTS.BLOGS)
      .pipe(map(res => {
        const blogs = Array.isArray(res.data) ? res.data : [];
        return blogs.map(blog => {
          blog.author = {
            name: blog.authorName || '',
            title: blog.authorTitle || '',
            avatar: blog.authorAvatar || '',
            bio: blog.authorBio || ''
          };
          blog.date = blog.publishedAt || blog.updatedAt || blog.createdAt || '';
          return blog;
        });
      }));
  }

  getById(id: number): Observable<any> {
    return this.httpService.get<any>(ADMIN_API_ENDPOINTS.BLOG_BY_ID(id))
      .pipe(map(res => {
        const blog = res.data;
        blog.author = {
          name: blog.authorName || '',
          title: blog.authorTitle || '',
          avatar: blog.authorAvatar || '',
          bio: blog.authorBio || ''
        };
        blog.date = blog.publishedAt || blog.updatedAt || blog.createdAt || '';
        return blog;
      }));
  }

  add(blog: any): Observable<any> {
    const payload = {
      ...blog,
      authorName: blog.author?.name || '',
      authorTitle: blog.author?.title || '',
      authorAvatar: blog.author?.avatar || '',
      authorBio: blog.author?.bio || ''
    };
    delete payload.author;
    return this.httpService.post<any>(ADMIN_API_ENDPOINTS.BLOGS, payload);
  }

  update(id: number, updated: any): Observable<any> {
    const payload = {
      ...updated,
      authorName: updated.author?.name || '',
      authorTitle: updated.author?.title || '',
      authorAvatar: updated.author?.avatar || '',
      authorBio: updated.author?.bio || ''
    };
    delete payload.author;
    return this.httpService.put<any>(ADMIN_API_ENDPOINTS.BLOG_BY_ID(id), payload);
  }

  delete(id: number): Observable<any> {
    return this.httpService.delete<any>(ADMIN_API_ENDPOINTS.BLOG_BY_ID(id));
  }
}
