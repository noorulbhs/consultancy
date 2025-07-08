import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_SERVICES } from '../mock/mock-services';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor() {}

  getServices(): Observable<any[]> {
    return of(MOCK_SERVICES); // simulating backend response
  }
}
