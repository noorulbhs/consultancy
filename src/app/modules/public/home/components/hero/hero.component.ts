import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  tagline = '';
  heroSubtext = '';

  constructor() {
    // Load from localStorage or mock for demo; replace with service in real app
    let settings: any = {};
    try {
      const raw = localStorage.getItem('siteSettings');
      if (raw) settings = JSON.parse(raw);
    } catch {}
    this.tagline = settings.tagline || 'Empowering Digital Success with Modern IT Solutions';
    this.heroSubtext = settings.heroSubtext || 'We help startups and enterprises build scalable, secure, and cloud-native systems.';
  }
}
