import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { PUBLIC_API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FeatureToggleService {
  public latestToggles: { [id: string]: boolean } = {};

  constructor(private http: HttpService) {}

  getFeatureToggles(): Observable<{ [id: string]: boolean }> {
    return this.http.get<any>(PUBLIC_API_ENDPOINTS.FEATURES).pipe(
      map(res => {
        const toggles: { [id: string]: boolean } = {};
        (res.data?.features || []).forEach((f: any) => {
          toggles[f.id] = !!f.enabled;
        });
        this.latestToggles = toggles;
        // console.log('Feature toggles:', toggles);
        return toggles;
      })
    );
  }
}