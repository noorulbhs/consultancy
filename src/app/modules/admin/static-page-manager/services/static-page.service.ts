// src/app/modules/admin/static-page-manager/services/static-page.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { STATIC_PAGES, StaticPage } from '../mock/static-content';

@Injectable({
  providedIn: 'root'
})
export class StaticPageService {
  private pages: { [key: string]: StaticPage } = { ...STATIC_PAGES };
  private pagesSubject = new BehaviorSubject<StaticPage[]>(Object.values(this.pages));

  getById(id: string): Observable<StaticPage | undefined> {
    return of(this.pages[id]);
  }

  update(id: string, data: Partial<StaticPage>): Observable<{ success: boolean; message: string }> {
    if (this.pages[id]) {
      this.pages[id] = { 
        ...this.pages[id], 
        ...data, 
        id,
        lastUpdated: new Date()
      };
      this.pagesSubject.next(Object.values(this.pages));
      return of({ success: true, message: 'Page updated successfully' });
    }
    return of({ success: false, message: 'Page not found' });
  }

  create(data: Omit<StaticPage, 'lastUpdated'>): Observable<{ success: boolean; message: string }> {
    const newPage: StaticPage = {
      ...data,
      lastUpdated: new Date()
    };
    this.pages[data.id] = newPage;
    this.pagesSubject.next(Object.values(this.pages));
    return of({ success: true, message: 'Page created successfully' });
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    if (this.pages[id]) {
      delete this.pages[id];
      this.pagesSubject.next(Object.values(this.pages));
      return of({ success: true, message: 'Page deleted successfully' });
    }
    return of({ success: false, message: 'Page not found' });
  }

  getAll(): Observable<StaticPage[]> {
    return of(Object.values(this.pages));
  }

  getByCategory(category: string): Observable<StaticPage[]> {
    const filteredPages = Object.values(this.pages).filter(page => page.category === category);
    return of(filteredPages);
  }

  getPublished(): Observable<StaticPage[]> {
    const publishedPages = Object.values(this.pages).filter(page => page.status === 'published');
    return of(publishedPages);
  }

  // Method to get content for public pages
  getContent(id: string): Observable<string> {
    const page = this.pages[id];
    return of(page ? page.content : '');
  }

  // Search functionality
  search(query: string): Observable<StaticPage[]> {
    const searchResults = Object.values(this.pages).filter(page => 
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.content.toLowerCase().includes(query.toLowerCase()) ||
      (page.keywords && page.keywords.some(keyword => 
        keyword.toLowerCase().includes(query.toLowerCase())
      ))
    );
    return of(searchResults);
  }
}
