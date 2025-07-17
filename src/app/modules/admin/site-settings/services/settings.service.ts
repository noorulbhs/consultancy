import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SITE_SETTINGS, SiteSettings } from '../mock/settings-data';
import { HttpService } from '../../../../core/services/http.service';
import { DataSourceService } from '../../../../core/services/data-source.service';
import { PUBLIC_API_ENDPOINTS, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<SiteSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  constructor(
    private httpService: HttpService
  ) {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.getSettingsFromAPI().subscribe(settings => {
      this.settingsSubject.next(settings);
    });
  }

  // loadMockSettings removed: always use backend

  private getSettingsFromAPI(): Observable<SiteSettings> {
    return this.httpService.get<SiteSettings>(
      PUBLIC_API_ENDPOINTS.SETTINGS,
      { isPublic: true }
    ).pipe(
      map(response => {
        const data: any = response.data || {};
        // Parse JSON string fields if present and not already objects
        const parseIfString = (val: any) => {
          if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return val; }
          }
          return val;
        };
        return {
          ...data,
          businessHours: parseIfString(data.businessHours),
          social: parseIfString(data.social),
          seo: parseIfString(data.seo),
          footer: parseIfString(data.footer),
          contactForm: parseIfString(data.contactForm),
          statistics: parseIfString(data.statistics)
        } as SiteSettings;
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  getSettings(): Observable<SiteSettings> {
    return this.getSettingsFromAPI();
  }

  updateSettings(updated: Partial<SiteSettings>): Observable<{ success: boolean; message: string }> {
    return this.httpService.put(
      ADMIN_API_ENDPOINTS.SETTINGS,
      updated,
      { isPublic: false }
    ).pipe(
      map(response => ({ success: true, message: 'Settings updated successfully' })),
      catchError(error => {
        return of({ success: false, message: 'Failed to update settings' });
      })
    );
  }

  // resetSettings removed: always use backend

  getSettingsForFooter(): Observable<any> {
    return this.getSettings().pipe(
      map(settings => ({
        companyName: settings.companyName,
        address: settings.address,
        city: settings.city,
        state: settings.state,
        country: settings.country,
        phone: settings.phone,
        email: settings.email,
        social: settings.social,
        footer: settings.footer,
        businessHours: settings.businessHours
      }))
    );
  }

  validateSettings(settings: Partial<SiteSettings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!settings.companyName?.trim()) {
      errors.push('Company name is required');
    }

    if (!settings.email?.trim() || !this.isValidEmail(settings.email)) {
      errors.push('Valid email is required');
    }

    if (!settings.phone?.trim()) {
      errors.push('Phone number is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
