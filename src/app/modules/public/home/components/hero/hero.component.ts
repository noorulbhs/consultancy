import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../../admin/site-settings/services/settings.service';

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

  constructor(private settingsService: SettingsService) {
    this.settingsService.settings$.subscribe(settings => {
      this.tagline = settings?.tagline || 'Empowering Digital Success with Modern IT Solutions';
      this.heroSubtext = settings?.heroSubtext || 'We help startups and enterprises build scalable, secure, and cloud-native systems.';
    });
  }
}
