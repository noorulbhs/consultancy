import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private featuresSubject = new BehaviorSubject<FeatureToggle[]>([
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
      enabled: true,
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
      id: 'testimonials-more-stories',
      name: 'More Client Success Stories',
      description: 'Show additional testimonials grid below the carousel',
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
      enabled: true,
      section: 'navigation'
    }
  ]);

  private features$ = this.featuresSubject.asObservable();

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
    const features = this.featuresSubject.value.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    );
    this.featuresSubject.next(features);
    this.saveToLocalStorage(features);
  }

  updateFeature(featureId: string, enabled: boolean): void {
    const features = this.featuresSubject.value.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled }
        : feature
    );
    this.featuresSubject.next(features);
    this.saveToLocalStorage(features);
  }

  private saveToLocalStorage(features: FeatureToggle[]): void {
    localStorage.setItem('featureToggles', JSON.stringify(features));
  }

  private loadFromLocalStorage(): FeatureToggle[] {
    const stored = localStorage.getItem('featureToggles');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored feature toggles:', error);
      }
    }
    return this.featuresSubject.value;
  }

  initializeFromStorage(): void {
    const storedFeatures = this.loadFromLocalStorage();
    if (storedFeatures.length > 0) {
      this.featuresSubject.next(storedFeatures);
    }
  }
}
