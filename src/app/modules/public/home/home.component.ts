import { Component, OnInit } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { AboutComponent } from './about/about.component';
import { WhyChooseUsComponent } from './components/why-choose-us/why-choose-us.component';
import { StatsComponent } from './components/stats/stats.component';
import { FeaturedTeamComponent } from './components/featured-team/featured-team.component';
import { CtaComponent } from './components/cta/cta.component';
import { CommonModule } from '@angular/common';
import { FeatureToggleService } from '../../admin/services/feature-toggle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    WhyChooseUsComponent,
    StatsComponent,
    FeaturedTeamComponent,
    TestimonialsComponent,
    CtaComponent
  ],
  templateUrl:"./home.component.html",
})
export class HomeComponent implements OnInit {
  // Feature toggle states
  showStats = true;
  showFeaturedTeam = true;
  showTestimonials = true;
  showWhyChooseUs = true;
  showCta = true;

  constructor(private featureToggleService: FeatureToggleService) {}

  ngOnInit(): void {
    this.featureToggleService.initializeFromStorage();
    this.loadFeatureToggles();
  }

  private loadFeatureToggles(): void {
    this.featureToggleService.getFeatures().subscribe(features => {
      this.showStats = this.featureToggleService.isFeatureEnabled('stats-section');
      this.showFeaturedTeam = this.featureToggleService.isFeatureEnabled('featured-team-section');
      this.showTestimonials = this.featureToggleService.isFeatureEnabled('testimonials-section');
      this.showWhyChooseUs = this.featureToggleService.isFeatureEnabled('why-choose-us-section');
      this.showCta = this.featureToggleService.isFeatureEnabled('cta-section');
      // Note: testimonials-more-stories is handled within the testimonials component itself
    });
  }
}
