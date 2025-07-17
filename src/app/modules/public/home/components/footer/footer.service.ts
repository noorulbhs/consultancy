import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { PUBLIC_API_ENDPOINTS } from '../../../../../core/constants/api-endpoints';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FooterService {

  constructor(private http: HttpService) {}

  getFooterData(): Observable<any> {
    return this.http.get<any>(PUBLIC_API_ENDPOINTS.SETTINGS).pipe(
      map(res => {
        const data = res.data;
        return {
          company: {
            name: data.companyName,
            description: data.description
          },
          quickLinks: (data.footer?.quickLinks || []).map((link: any) => ({
            label: link.title || link.label,
            path: link.url || link.path || '#'
          })),
          contact: {
            email: data.email,
            phone: data.phone
          },
          social: Object.entries(data.social || {}).map(([platform, url]) => ({
            platform,
            url
          })),
          copyright: data.footer?.copyrightText || ''
        };
      })
    );
  }
}