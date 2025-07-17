// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { HttpService } from '../../../core/services/http.service';
// import { ADMIN_API_ENDPOINTS } from '../../../core/constants/api-endpoints';

// export interface FeatureToggle {
//   id: string;
//   name: string;
//   description: string;
//   enabled: boolean;
//   section: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class FeatureToggleService {
//   // Static list of features (do not change)
//   private staticFeatures: FeatureToggle[] = [];
//   private featuresSubject = new BehaviorSubject<FeatureToggle[]>([...this.staticFeatures]);

//   private features$ = this.featuresSubject.asObservable();

//   constructor(private http: HttpService) {
//     this.loadFeatureStatusesFromBackend();
//   }

//   /**
//    * Loads the enabled status for each feature from the backend, but keeps the static feature list.
//    * Only the 'enabled' property is updated from backend.
//    */
//   loadFeatureStatusesFromBackend(): void {
//   this.http.get<any>(ADMIN_API_ENDPOINTS.FEATURES).subscribe({
//     next: (res) => {
//       const backendFeatures = Array.isArray(res?.data?.features) ? res.data.features : [];
//       // Replace static features with backend features by id, or keep static if not present in backend
//       const updated = this.staticFeatures.map(staticFeature => {
//         const backend = backendFeatures.find((f: any) => f.id === staticFeature.id);
//         return backend ? { ...staticFeature, ...backend } : staticFeature;
//       });
//       // Optionally, add backend features not present in staticFeatures
//       backendFeatures.forEach((backend: any) => {
//         if (!updated.find(f => f.id === backend.id)) {
//           updated.push(backend);
//         }
//       });
//       this.featuresSubject.next(updated);
//     },
//     error: (err) => {
//       // fallback: keep static features
//     }
//   });
// }

//   getFeatures(): Observable<FeatureToggle[]> {
//   return this.http.get<any>(ADMIN_API_ENDPOINTS.FEATURES).pipe(
//     map(res => res.data?.features || [])
//   );
// }

//   getFeaturesBySection(section: string): Observable<FeatureToggle[]> {
//     return new BehaviorSubject(
//       this.featuresSubject.value.filter(feature => feature.section === section)
//     ).asObservable();
//   }

//   isFeatureEnabled(featureId: string): boolean {
//     const feature = this.featuresSubject.value.find(f => f.id === featureId);
//     return feature ? feature.enabled : false;
//   }

//   toggleFeature(featureId: string): void {
//     const current = this.featuresSubject.value.find(f => f.id === featureId);
//     if (!current) return;
//     const newStatus = !current.enabled;
//     // Optimistically update UI
//     const features = this.featuresSubject.value.map(feature =>
//       feature.id === featureId ? { ...feature, enabled: newStatus } : feature
//     );
//     this.featuresSubject.next(features);
//     // Persist to backend
//     this.http.put<any>(ADMIN_API_ENDPOINTS.FEATURE_BY_ID(featureId), { enabled: newStatus }).subscribe({
//       error: () => {
//         // Revert on error
//         this.featuresSubject.next(this.featuresSubject.value.map(feature =>
//           feature.id === featureId ? { ...feature, enabled: !newStatus } : feature
//         ));
//       }
//     });
//   }

//   updateFeature(featureId: string, enabled: boolean): void {
//     const features = this.featuresSubject.value.map(feature =>
//       feature.id === featureId ? { ...feature, enabled } : feature
//     );
//     this.featuresSubject.next(features);
//     this.http.put<any>(ADMIN_API_ENDPOINTS.FEATURE_BY_ID(featureId), { enabled }).subscribe({
//       error: () => {
//         // Optionally revert or notify
//       }
//     });
//   }

//   // LocalStorage methods removed; now using backend only
// }

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  constructor(private http: HttpService) {}

  // Get all features from backend
  getFeatures(): Observable<FeatureToggle[]> {
    return this.http.get<any>(ADMIN_API_ENDPOINTS.FEATURES).pipe(
      map(res => res.data?.features || [])
    );
  }

  // Get features by section (e.g., 'home', 'navigation', etc.)
  getFeaturesBySection(section: string): Observable<FeatureToggle[]> {
    return this.getFeatures().pipe(
      map(features => features.filter(feature => feature.section === section))
    );
  }

  // Check if a feature is enabled by id
  isFeatureEnabled(featureId: string): Observable<boolean> {
    return this.getFeatures().pipe(
      map(features => {
        const feature = features.find(f => f.id === featureId);
        return feature ? feature.enabled : false;
      })
    );
  }

  // Toggle a feature's enabled status
  toggleFeature(featureId: string, enabled: boolean): Observable<any> {
    return this.http.put<any>(ADMIN_API_ENDPOINTS.FEATURE_BY_ID(featureId), { enabled });
  }

  // Update a feature's enabled status (alias for toggle)
  updateFeature(featureId: string, enabled: boolean): Observable<any> {
    return this.toggleFeature(featureId, enabled);
  }
}
