import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { DataSourceService } from './data-source.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  constructor(
    private http: HttpClient,
    private dataSourceService: DataSourceService
  ) {}

  // GET request
  get<T>(endpoint: string, options?: {
    params?: HttpParams | { [key: string]: any };
    headers?: HttpHeaders;
    isPublic?: boolean;
  }): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.isPublic);
    const headers = this.buildHeaders(options?.headers, options?.isPublic);
    // console.log('[HttpService][GET] URL:', url);
    // console.log('[HttpService][GET] Headers:', headers);
    return this.http.get<ApiResponse<T>>(url, {
      headers
    }).pipe(
      retry(this.MAX_RETRIES),
      map((res: any) => {
        // console.log('[HttpService][GET] Response:', res);
        return res;
      }),
      catchError(this.handleError)
    );
  }


  // POST request
  post<T>(endpoint: string, body: any, options?: {
    headers?: HttpHeaders;
    isPublic?: boolean;
  }): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.isPublic);
    const headers = this.buildHeaders(options?.headers, options?.isPublic);
    console.log('[HttpService][POST] URL:', url);
    console.log('[HttpService][POST] Body:', body);
    console.log('[HttpService][POST] Headers:', headers);
    return this.http.post<ApiResponse<T>>(url, body, { headers }).pipe(
      retry(this.MAX_RETRIES),
      map((res: any) => {
        console.log('[HttpService][POST] Response:', res);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // PUT request
  put<T>(endpoint: string, body: any, options?: {
    headers?: HttpHeaders;
    isPublic?: boolean;
  }): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.isPublic);
    const headers = this.buildHeaders(options?.headers, options?.isPublic);
    console.log('[HttpService][PUT] URL:', url);
    console.log('[HttpService][PUT] Body:', body);
    console.log('[HttpService][PUT] Headers:', headers);
    return this.http.put<ApiResponse<T>>(url, body, { headers }).pipe(
      retry(this.MAX_RETRIES),
      map((res: any) => {
        console.log('[HttpService][PUT] Response:', res);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // DELETE request
  delete<T>(endpoint: string, options?: {
    headers?: HttpHeaders;
    isPublic?: boolean;
  }): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.isPublic);
    const headers = this.buildHeaders(options?.headers, options?.isPublic);
    console.log('[HttpService][DELETE] URL:', url);
    console.log('[HttpService][DELETE] Headers:', headers);
    return this.http.delete<ApiResponse<T>>(url, { headers }).pipe(
      retry(this.MAX_RETRIES),
      map((res: any) => {
        console.log('[HttpService][DELETE] Response:', res);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // File upload
  uploadFile(endpoint: string, file: File, additionalData?: any): Observable<ApiResponse<any>> {
    const url = this.buildUrl(endpoint, false); // File upload is always admin
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers = this.buildHeaders(undefined, false);
    // Remove content-type header to let browser set it with boundary
    headers.delete('Content-Type');

    return this.http.post<ApiResponse<any>>(url, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private buildUrl(endpoint: string, isPublic?: boolean): string {
    const baseUrl = this.dataSourceService.getApiBaseUrl();
    return `${baseUrl}${endpoint}`;
  }

  private buildHeaders(customHeaders?: HttpHeaders, isPublic?: boolean): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Add authentication header for admin endpoints
    if (!isPublic) {
      const token = this.getAuthToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Add custom headers if provided
    if (customHeaders) {
      customHeaders.keys().forEach(key => {
        const value = customHeaders.get(key);
        if (value) {
          headers = headers.set(key, value);
        }
      });
    }

    return headers;
  }

  private getAuthToken(): string | null {
    // Get token from localStorage or your auth service
    return localStorage.getItem('authToken');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
        // Handle token refresh or redirect to login
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You don\'t have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('HTTP Error:', error);
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      error: error.error
    }));
  }
}
