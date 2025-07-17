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
      this.loadMockSettings();
    }
  }

  private loadMockSettings(): void {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Check if version matches - if not, clear old settings
        if (parsed.version !== SITE_SETTINGS.version) {
          console.log('Settings version mismatch, clearing old data...');
          localStorage.removeItem('siteSettings');
          this.settings = { ...SITE_SETTINGS };
        } else {
          // Merge with latest mock data to ensure new fields are included
          this.settings = { ...SITE_SETTINGS, ...parsed };
        }
      } catch (error) {
        // If parsing fails, use default settings
        this.settings = { ...SITE_SETTINGS };
        localStorage.removeItem('siteSettings');
      }
    } else {
      this.settings = { ...SITE_SETTINGS };
    }
    this.settingsSubject.next(this.settings);
  }

  private getSettingsFromAPI(): Observable<SiteSettings> {
    return this.httpService.get<SiteSettings>(
      PUBLIC_API_ENDPOINTS.SETTINGS,
      { isPublic: true }
    ).pipe(
      map(response => response.data || { ...SITE_SETTINGS }),
      catchError(error => {
        // removed log
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
          // removed log
          return of({ success: false, message: 'Failed to update settings' });
        })
      );
    } else {
      try {
        this.settings = { 
          ...this.settings, 
          ...updated, 
          lastUpdated: new Date(),
          updatedBy: 'admin' // In real app, this would be the current user
        };
        
        // Save to localStorage
        localStorage.setItem('siteSettings', JSON.stringify(this.settings));
        
        // Update subject
        this.settingsSubject.next(this.settings);
        
        return of({ success: true, message: 'Settings updated successfully' });
      } catch (error) {
        // removed log
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

  // Get specific setting categories
  getCompanyInfo(): Observable<any> {
    return of({
      companyName: this.settings.companyName,
      tagline: this.settings.tagline,
      description: this.settings.description,
      logoUrl: this.settings.logoUrl,
      faviconUrl: this.settings.faviconUrl
    });
  }

  getContactInfo(): Observable<any> {
    return of({
      email: this.settings.email,
      phone: this.settings.phone,
      address: this.settings.address,
      city: this.settings.city,
      state: this.settings.state,
      country: this.settings.country,
      zipCode: this.settings.zipCode
    });
  }

  getSocialMedia(): Observable<any> {
    return of(this.settings.social);
  }

  getSeoSettings(): Observable<any> {
    return of(this.settings.seo);
  }

  getStatistics(): Observable<any> {
    return of(this.settings.statistics);
  }

  getContactForm(): Observable<any> {
    return of(this.settings.contactForm);
  }

  getBusinessHours(): Observable<any> {
    return of(this.settings.businessHours);
  }

  // Refresh settings from API or localStorage
  refreshSettings(): void {
    this.loadSettings();
  }
}
