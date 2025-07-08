import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FOOTER_DATA } from '../mock/footer-data';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  constructor() {}

  getFooterData(): Observable<any> {
    return of(FOOTER_DATA); // simulating HTTP API
  }
}
