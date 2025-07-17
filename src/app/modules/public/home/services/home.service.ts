import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MOCK_SERVICES } from '../mock/mock-services';
import { Service } from '../../../../core/interfaces/content.interface';
import { HttpService } from '../../../../core/services/http.service';
import { DataSourceService } from '../../../../core/services/data-source.service';
import { PUBLIC_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {}

  getServices(): Observable<Service[]> {
    if (this.dataSourceService.shouldUseRealData('services')) {
      return this.getServicesFromAPI();
    } else {
      return this.getServicesFromMock();
    }
  }

  private getServicesFromAPI(): Observable<Service[]> {
    return this.httpService.get<Service[]>(
      PUBLIC_API_ENDPOINTS.SERVICES,
      { isPublic: true }
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        // removed log
        return this.getServicesFromMock();
      })
    );
  }

  private getServicesFromMock(): Observable<Service[]> {
    // Convert mock data to proper Service interface
    const services: Service[] = MOCK_SERVICES.map(mockService => ({
      id: mockService.id,
      title: mockService.name,
      description: mockService.description,
      detailedDescription: mockService.description,
      category: 'General',
      icon: mockService.icon,
      features: [],
      technologies: [],
      duration: '2-4 weeks',
      deliverables: [],
      featured: false,
      status: 'active' as const
    }));
    
    return of(services);
  }

  // Get featured services only
  getFeaturedServices(): Observable<Service[]> {
    return this.getServices().pipe(
      map(services => services.filter(service => service.featured))
    );
  }

  // Get service by ID
  getServiceById(id: number): Observable<Service | undefined> {
    if (this.dataSourceService.shouldUseRealData('services')) {
      return this.httpService.get<Service>(
        PUBLIC_API_ENDPOINTS.SERVICE_BY_ID(id),
        { isPublic: true }
      ).pipe(
        map(response => response.data),
        catchError(error => {
          // removed log
          return of(undefined);
        })
      );
    } else {
      return this.getServices().pipe(
        map(services => services.find(service => service.id === id))
      );
    }
  }
}
