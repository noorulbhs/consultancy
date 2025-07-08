import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations()
  ]
};

/*
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig = [
  provideRouter(routes),
  // we'll add HTTPClientModule, animations etc. here soon
];

*/