import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { SiteSettings } from '../../../core/interfaces/site-settings.interface';
import { HeroComponent } from './components/hero/hero.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { AboutComponent } from './about/about.component';
import { WhyChooseUsComponent } from './components/why-choose-us/why-choose-us.component';
import { StatsComponent } from './components/stats/stats.component';
import { FeaturedTeamComponent } from './components/featured-team/featured-team.component';
import { CommonModule } from '@angular/common';
import { FeatureToggleService } from '../featuretoggle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    WhyChooseUsComponent,
    StatsComponent,
    FeaturedTeamComponent,
    TestimonialsComponent
  ],
  templateUrl:"./home.component.html",
})
export class HomeComponent implements OnInit {
  // Feature toggle states
  showStats = true;
  showFeaturedTeam = true;
  showTestimonials = true;
  showWhyChooseUs = true;

  constructor(
    private featureToggleService: FeatureToggleService,
    private meta: Meta,
    private title: Title,
    private settingsService: SiteSettingsService
  ) {}

  ngOnInit(): void {
    this.loadFeatureToggles();
    // Set SEO meta tags from site settings
    this.settingsService.settings$.subscribe((settings: SiteSettings | null) => {
      if (settings && settings.seo) {
        this.title.setTitle(settings.seo.metaTitle);
        this.meta.updateTag({ name: 'description', content: settings.seo.metaDescription });
        this.meta.updateTag({ name: 'keywords', content: (settings.seo.keywords || []).join(', ') });
        // Inject Google Analytics if ID is present
        if (settings.seo.googleAnalyticsId && !document.getElementById('google-analytics-script')) {
          const gaScript = document.createElement('script');
          gaScript.id = 'google-analytics-script';
          gaScript.async = true;
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.seo.googleAnalyticsId}`;
          document.head.appendChild(gaScript);
          const gaInit = document.createElement('script');
          gaInit.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${settings.seo.googleAnalyticsId}');`;
          document.head.appendChild(gaInit);
        }
        // Inject Facebook Pixel if ID is present
        if (settings.seo.facebookPixelId && !document.getElementById('facebook-pixel-script')) {
          const fbScript = document.createElement('script');
          fbScript.id = 'facebook-pixel-script';
          fbScript.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${settings.seo.facebookPixelId}');fbq('track', 'PageView');`;
          document.head.appendChild(fbScript);
          // Add noscript fallback
          const fbNoScript = document.createElement('noscript');
          fbNoScript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${settings.seo.facebookPixelId}&ev=PageView&noscript=1"/>`;
          document.head.appendChild(fbNoScript);
        }
      }
    });
  }

  private loadFeatureToggles(): void {
    this.featureToggleService.getFeatureToggles().subscribe(() => {
      const toggles = this.featureToggleService.latestToggles || {};
      this.showStats = !!toggles['stats-section'];
      this.showFeaturedTeam = !!toggles['featured-team-section'];
      this.showTestimonials = !!toggles['testimonials-section'];
      this.showWhyChooseUs = !!toggles['why-choose-us-section'];
    });
  }
}
