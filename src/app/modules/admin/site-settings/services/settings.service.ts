import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { SITE_SETTINGS, SiteSettings } from '../mock/settings-data';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings = { ...SITE_SETTINGS };
  private settingsSubject = new BehaviorSubject<SiteSettings>(this.settings);
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
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

  getSettings(): Observable<SiteSettings> {
    return of(this.settings);
  }

  updateSettings(updated: Partial<SiteSettings>): Observable<{ success: boolean; message: string }> {
    try {
      this.settings = { 
        ...this.settings, 
        ...updated, 
        lastUpdated: new Date(),
        updatedBy: 'admin' // In real app, this would be the current user
      };
      
      // Save to localStorage
      localStorage.setItem('siteSettings', JSON.stringify(this.settings));
      
      // Notify subscribers
      this.settingsSubject.next(this.settings);
      
      return of({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
      return of({ success: false, message: 'Failed to update settings' });
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
