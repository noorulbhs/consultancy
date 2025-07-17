import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../core/services/http.service';
import { ADMIN_API_ENDPOINTS } from '../../../core/constants/api-endpoints';

export interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  section: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureToggleService {
  // Static list of features (do not change)
  private staticFeatures: FeatureToggle[] = [
    {
      id: 'stats-section',
      name: 'Our Track Record',
      description: 'Display statistics and metrics on the home page',
      enabled: true,
      section: 'home'
    },
    {
      id: 'featured-team-section',
      name: 'Meet Our Expert Team',
      description: 'Show featured team members on the home page',
      enabled: false,
      section: 'home'
    },
    {
      id: 'testimonials-section',
      name: 'What Our Clients Say',
      description: 'Display client testimonials carousel on the home page',
      enabled: true,
      section: 'home'
    },
    {
      id: 'why-choose-us-section',
      name: 'Why Choose Us',
      description: 'Show company advantages and benefits',
      enabled: true,
      section: 'home'
    },
    {
      id: 'cta-section',
      name: 'Call to Action',
      description: 'Display call-to-action section on the home page',
      enabled: true,
      section: 'home'
    },
    {
      id: 'navbar-blog',
      name: 'Blog Navigation',
      description: 'Show/hide Blog link in the main navigation menu',
      enabled: true,
      section: 'navigation'
    },
    {
      id: 'navbar-careers',
      name: 'Careers Navigation', 
      description: 'Show/hide Careers link in the main navigation menu',
      enabled: false,
      section: 'navigation'
    }
  ];
  private featuresSubject = new BehaviorSubject<FeatureToggle[]>([...this.staticFeatures]);

  private features$ = this.featuresSubject.asObservable();

  constructor(private http: HttpService) {
    this.loadFeatureStatusesFromBackend();
  }

  /**
   * Loads the enabled status for each feature from the backend, but keeps the static feature list.
   * Only the 'enabled' property is updated from backend.
   */
  loadFeatureStatusesFromBackend(): void {
    this.http.get<any>(ADMIN_API_ENDPOINTS.FEATURES).subscribe({
      next: (res) => {
        // Assume backend returns: { data: [{ id, enabled }, ...] }
        const backendStatuses = Array.isArray(res?.data) ? res.data : [];
        const updated = this.staticFeatures.map(staticFeature => {
          const backend = backendStatuses.find((f: any) => f.id === staticFeature.id);
          return backend ? { ...staticFeature, enabled: backend.enabled } : staticFeature;
        });
        this.featuresSubject.next(updated);
      },
      error: (err) => {
        // fallback: keep static features
      }
    });
  }

  getFeatures(): Observable<FeatureToggle[]> {
    return this.features$;
  }

  getFeaturesBySection(section: string): Observable<FeatureToggle[]> {
    return new BehaviorSubject(
      this.featuresSubject.value.filter(feature => feature.section === section)
    ).asObservable();
  }

  isFeatureEnabled(featureId: string): boolean {
    const feature = this.featuresSubject.value.find(f => f.id === featureId);
    return feature ? feature.enabled : false;
  }

  toggleFeature(featureId: string): void {
    const current = this.featuresSubject.value.find(f => f.id === featureId);
    if (!current) return;
    const newStatus = !current.enabled;
    // Optimistically update UI
    const features = this.featuresSubject.value.map(feature =>
      feature.id === featureId ? { ...feature, enabled: newStatus } : feature
    );
    this.featuresSubject.next(features);
    // Persist to backend
    this.http.put<any>(ADMIN_API_ENDPOINTS.FEATURE_BY_ID(featureId), { enabled: newStatus }).subscribe({
      error: () => {
        // Revert on error
        this.featuresSubject.next(this.featuresSubject.value.map(feature =>
          feature.id === featureId ? { ...feature, enabled: !newStatus } : feature
        ));
      }
    });
  }

  updateFeature(featureId: string, enabled: boolean): void {
    const features = this.featuresSubject.value.map(feature =>
      feature.id === featureId ? { ...feature, enabled } : feature
    );
    this.featuresSubject.next(features);
    this.http.put<any>(ADMIN_API_ENDPOINTS.FEATURE_BY_ID(featureId), { enabled }).subscribe({
      error: () => {
        // Optionally revert or notify
      }
    });
  }

  // LocalStorage methods removed; now using backend only
}
