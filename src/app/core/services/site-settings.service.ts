
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SiteSettings } from '../interfaces/site-settings.interface';
import { SITE_SETTINGS } from '../../modules/admin/site-settings/mock/settings-data';
import { HttpService } from './http.service';
import { DataSourceService } from './data-source.service';
import { PUBLIC_API_ENDPOINTS, ADMIN_API_ENDPOINTS } from '../constants/api-endpoints';


// Shared singleton for static site settings (mock mode)
export const SHARED_MOCK_SITE_SETTINGS: SiteSettings = { ...SITE_SETTINGS };
// Shared subject for all service instances
export const SHARED_SETTINGS_SUBJECT = new BehaviorSubject<SiteSettings | null>(SHARED_MOCK_SITE_SETTINGS);

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {

  public settings$ = SHARED_SETTINGS_SUBJECT.asObservable();

  constructor(
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.getSettings().subscribe(settings => {
      SHARED_SETTINGS_SUBJECT.next(settings);
    });
  }

  getSettings(): Observable<SiteSettings> {
    if (this.dataSourceService.shouldUseRealData('siteSettings')) {
      return this.getSettingsFromAPI();
    } else {
      return this.getSettingsFromMock();
    }
  }

  private getSettingsFromAPI(): Observable<SiteSettings> {
    return this.httpService.get<SiteSettings>(
      PUBLIC_API_ENDPOINTS.SETTINGS,
      { isPublic: true }
    ).pipe(
      map(response => response.data || this.getDefaultSettings()),
      catchError(error => {
        console.error('Error fetching settings from API, falling back to mock data:', error);
        return this.getSettingsFromMock();
      })
    );
  }

  private getSettingsFromMock(): Observable<SiteSettings> {
    // Always use the shared singleton for static settings
    return of(SHARED_MOCK_SITE_SETTINGS);
  }

  private getDefaultSettings(): SiteSettings {
    return {
      id: 'main-settings',
      version: '2.0',
      companyName: 'Altrevo Tech Solutions',
      tagline: 'Innovative Technology Solutions for Modern Business',
      description: 'Leading technology consultancy providing innovative solutions for digital transformation, cloud migration, and enterprise modernization.',
      logoUrl: 'altrevo-logo.png',
      faviconUrl: 'altrevo-favicon.png',
      email: 'contact@altrevo.com',
      phone: '+1 (555) 123-4567',
      address: '123 Innovation Drive, Suite 100',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      zipCode: '94107',
      social: {
        linkedin: 'https://linkedin.com/company/altrevo-tech-solutions',
        facebook: 'https://facebook.com/altrevotechsolutions',
        instagram: 'https://instagram.com/altrevotechsolutions',
        twitter: 'https://twitter.com/altrevotechsolutions',
        github: 'https://github.com/altrevotechsolutions'
      },
      seo: {
        metaTitle: 'Altrevo Tech Solutions - Leading Technology Consultancy',
        metaDescription: 'Transform your business with Altrevo\'s expert technology consulting services. Specializing in cloud migration, digital transformation, and enterprise solutions.',
        keywords: ['technology consulting', 'digital transformation', 'cloud solutions', 'enterprise modernization'],
        googleAnalyticsId: 'GA-XXXXX-X'
      },
      footer: {
        copyrightText: '© 2024 Altrevo Tech Solutions. All rights reserved.',
        quickLinks: [
          { title: 'Privacy Policy', url: '/privacy-policy', enabled: true },
          { title: 'Terms of Service', url: '/terms-of-service', enabled: true },
          { title: 'Cookie Policy', url: '/cookie-policy', enabled: true }
        ]
      },
      contactForm: {
        recipientEmail: 'inquiries@altrevo.com',
        subjectOptions: [
          { value: 'general', label: 'General Inquiry', enabled: true },
          { value: 'consultation', label: 'Free Consultation', enabled: true },
          { value: 'support', label: 'Technical Support', enabled: true },
          { value: 'partnership', label: 'Partnership Opportunity', enabled: true }
        ],
        serviceOptions: [
          { value: 'Cloud Migration', label: 'Cloud Migration', enabled: true },
          { value: 'DevOps Strategy', label: 'DevOps Strategy', enabled: true },
          { value: 'Digital Transformation', label: 'Digital Transformation', enabled: true },
          { value: 'Enterprise Solutions', label: 'Enterprise Solutions', enabled: true }
        ]
      },
      statistics: {
        projectsCompleted: {
          number: '150+',
          label: 'Projects Completed',
          icon: 'fas fa-project-diagram',
          enabled: true
        },
        clientsSatisfied: {
          number: '98%',
          label: 'Client Satisfaction',
          icon: 'fas fa-smile',
          enabled: true
        },
        yearsExperience: {
          number: '10+',
          label: 'Years of Experience',
          icon: 'fas fa-calendar-alt',
          enabled: true
        },
        teamMembers: {
          number: '25+',
          label: 'Expert Team Members',
          icon: 'fas fa-users',
          enabled: true
        }
      }
    };
  }

  // Update settings (Admin only)
  updateSettings(settings: Partial<SiteSettings>): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('siteSettings')) {
      return this.httpService.put(
        ADMIN_API_ENDPOINTS.SETTINGS,
        settings,
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Settings updated successfully' })),
        catchError(error => {
          console.error('Error updating settings:', error);
          return of({ success: false, message: 'Failed to update settings' });
        })
      );
    } else {
      // Update the shared mock singleton from admin
      console.log('[SETTINGS SERVICE] updateSettings called with:', settings);
      Object.assign(SHARED_MOCK_SITE_SETTINGS, settings);
      console.log('[SETTINGS SERVICE] SHARED_MOCK_SITE_SETTINGS after update:', SHARED_MOCK_SITE_SETTINGS);
      SHARED_SETTINGS_SUBJECT.next(SHARED_MOCK_SITE_SETTINGS);
      console.log('[SETTINGS SERVICE] SHARED_SETTINGS_SUBJECT emitted new value');
      return of({ success: true, message: 'Settings updated successfully (mock only)' });
    }
  }

  // Reset settings to default (mock only)
  resetSettings(): Observable<{ success: boolean; message: string }> {
    Object.assign(SHARED_MOCK_SITE_SETTINGS, SITE_SETTINGS);
    SHARED_SETTINGS_SUBJECT.next(SHARED_MOCK_SITE_SETTINGS);
    return of({ success: true, message: 'Settings reset to default (mock only)' });
  }

  // Get specific setting value
  getSetting<K extends keyof SiteSettings>(key: K): Observable<SiteSettings[K] | null> {
    return this.settings$.pipe(
      map(settings => settings ? settings[key] : null)
    );
  }

  // Get company info
  getCompanyInfo(): Observable<Partial<SiteSettings>> {
    return this.settings$.pipe(
      map(settings => settings ? {
        companyName: settings.companyName,
        tagline: settings.tagline,
        description: settings.description,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl
      } : {})
    );
  }

  // Get contact info
  getContactInfo(): Observable<Partial<SiteSettings>> {
    return this.settings$.pipe(
      map(settings => settings ? {
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        city: settings.city,
        state: settings.state,
        country: settings.country,
        zipCode: settings.zipCode
      } : {})
    );
  }

  // Get social media links
  getSocialMedia(): Observable<SiteSettings['social'] | null> {
    return this.settings$.pipe(
      map(settings => settings ? settings.social : null)
    );
  }

  // Get SEO settings
  getSeoSettings(): Observable<SiteSettings['seo'] | null> {
    return this.settings$.pipe(
      map(settings => settings ? settings.seo : null)
    );
  }

  // Get statistics
  getStatistics(): Observable<SiteSettings['statistics'] | null> {
    return this.settings$.pipe(
      map(settings => settings ? settings.statistics : null)
    );
  }

  // Refresh settings
  refreshSettings(): void {
    this.loadSettings();
  }
}
