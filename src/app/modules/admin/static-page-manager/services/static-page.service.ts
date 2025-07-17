// src/app/modules/admin/static-page-manager/services/static-page.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';
import { HttpService } from '../../../../core/services/http.service';
import { STATIC_PAGE_ENDPOINTS } from '../../../../core/constants/api-endpoints';

export interface StaticPage {
  id: string;
  title: string;
  content: string;
  lastUpdated: string | Date;
  status: 'published' | 'draft';
  category: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface StaticPageResponse {
  success: boolean;
  message: string;
  page?: StaticPage;
}

@Injectable({ providedIn: 'root' })
export class StaticPageService {
  private baseUrl = STATIC_PAGE_ENDPOINTS.GET_ALL_ADMIN;

  constructor(private http: HttpService) {}

  getAll(): Observable<StaticPage[]> {
    return this.http.get<StaticPage[]>(STATIC_PAGE_ENDPOINTS.GET_ALL_ADMIN).pipe(
      map((res: any) => Array.isArray(res) ? res : (res.data || []))
    );
  }

  getById(id: string): Observable<StaticPage> {
    return this.http.get<StaticPage>(STATIC_PAGE_ENDPOINTS.GET_BY_ID(id)).pipe(
      map((res: any) => res?.data ? res.data as StaticPage : res as StaticPage)
    );
  }

  create(page: Partial<StaticPage>): Observable<StaticPageResponse> {
    return this.http.post<StaticPage>(STATIC_PAGE_ENDPOINTS.CREATE, page).pipe(
      map((res: ApiResponse<StaticPage>) => ({
        success: res.success,
        message: res.message || '',
        page: res.data
      }))
    );
  }

  update(id: string, page: Partial<StaticPage>): Observable<StaticPageResponse> {
    return this.http.put<StaticPage>(STATIC_PAGE_ENDPOINTS.UPDATE(id), page).pipe(
      map((res: any) => ({
        success: res.success !== undefined ? res.success : true,
        message: res.message || '',
        page: res.data ? res.data : res
      }))
    );
  }

  delete(id: string): Observable<StaticPageResponse> {
    return this.http.delete<StaticPage>(STATIC_PAGE_ENDPOINTS.DELETE(id)).pipe(
      map((res: ApiResponse<StaticPage>) => ({
        success: res.success,
        message: res.message || ''
      }))
    );
  }

  // For public content fetch (used in about.component.ts)
  getContent(id: string): Observable<string> {
  return this.http.get<StaticPage>(`${STATIC_PAGE_ENDPOINTS.GET_ALL_PUBLIC}/${id}`, { isPublic: true }).pipe(
    map((res: any) => {
      if (res && res.data && res.data.content) {
        return res.data.content;
      }
      if (res && res.content) {
        return res.content;
      }
      return '';
    })
  );
}
}
