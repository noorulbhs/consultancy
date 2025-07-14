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
  private settings = { ...SITE_SETTINGS };
  private settingsSubject = new BehaviorSubject<SiteSettings>(this.settings);
  public settings$ = this.settingsSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {
    this.loadSettings();
  }

  private loadSettings(): void {
    if (this.dataSourceService.shouldUseRealData('siteSettings')) {
      this.getSettingsFromAPI().subscribe(settings => {
        this.settings = settings;
        this.settingsSubject.next(this.settings);
      });
    } else {
      this.settings = this.loadMockSettings();
      this.settingsSubject.next(this.settings);
    }
  }

  private loadMockSettings(): SiteSettings {
    // Try to load from localStorage, but robustly merge with mock
    let local: any = {};
    let useLocal = false;
    try {
      const raw = localStorage.getItem('siteSettings');
      if (raw) {
        local = JSON.parse(raw);
        // Check for required fields (add more as needed)
        if (
          typeof local === 'object' &&
          local !== null &&
          local.seo && Array.isArray(local.seo.keywords) &&
          local.footer && typeof local.footer === 'object'
        ) {
          useLocal = true;
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    // Merge with mock only if local is valid
    const merged = useLocal ? { ...SITE_SETTINGS, ...local } : { ...SITE_SETTINGS };
    return merged;
  }

  private getSettingsFromAPI(): Observable<SiteSettings> {
    return this.httpService.get<SiteSettings>(
      PUBLIC_API_ENDPOINTS.SETTINGS,
      { isPublic: true }
    ).pipe(
      map(response => response.data || { ...SITE_SETTINGS }),
      catchError(error => {
        return of({ ...SITE_SETTINGS });
      })
    );
  }

  getSettings(): Observable<SiteSettings> {
    if (this.dataSourceService.shouldUseRealData('siteSettings')) {
      return this.getSettingsFromAPI();
    } else {
      return of(this.settings);
    }
  }

  updateSettings(updated: Partial<SiteSettings>): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('siteSettings')) {
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
    } else {
      try {
        this.settings = { 
          ...this.settings, 
          ...updated, 
         lastUpdated: new Date().toISOString(),
          updatedBy: 'admin' // In real app, this would be the current user
        };
        // Save to localStorage
        localStorage.setItem('siteSettings', JSON.stringify(this.settings));
        // Update subject
        this.settingsSubject.next(this.settings);
        return of({ success: true, message: 'Settings updated successfully' });
      } catch (error) {
        return of({ success: false, message: 'Failed to update settings' });
      }
    }
  }

  resetSettings(): Observable<{ success: boolean; message: string }> {
    this.settings = { ...SITE_SETTINGS };
    localStorage.removeItem('siteSettings');
    this.settingsSubject.next(this.settings);
    return of({ success: true, message: 'Settings reset to default' });
  }

  getSettingsForFooter(): Observable<any> {
    return of({
      companyName: this.settings.companyName,
      address: this.settings.address,
      city: this.settings.city,
      state: this.settings.state,
      country: this.settings.country,
      phone: this.settings.phone,
      email: this.settings.email,
      social: this.settings.social,
      footer: this.settings.footer,
      businessHours: this.settings.businessHours
    });
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
