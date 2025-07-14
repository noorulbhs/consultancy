import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { SiteSettings } from '../../../../../core/interfaces/site-settings.interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  footerData: any;


  constructor(private settingsService: SiteSettingsService, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.settingsService.settings$.subscribe((settings: SiteSettings | null) => {
      console.log('[FOOTER] Received settings:', settings);
      if (!settings) return;
      this.footerData = {
        company: {
          name: settings.companyName,
          description: settings.description
        },
        contact: {
          email: settings.email,
          phone: settings.phone
        },
        social: Object.entries(settings.social || {}).map(([platform, url]: [string, string]) => ({ platform, url })),
        quickLinks: (settings.footer?.quickLinks || []).map((link: any) => ({ path: link.url, label: link.title })),
        copyright: settings.footer?.copyrightText || ''
      };
      console.log('[FOOTER] Updated footerData:', this.footerData);
      this.cdr.detectChanges();
    });
  }


  // No longer needed: updateQuickLinks
}
