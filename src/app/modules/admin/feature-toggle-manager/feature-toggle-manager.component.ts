import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatureToggleService, FeatureToggle } from '../services/feature-toggle.service';

@Component({
  selector: 'app-feature-toggle-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-toggle-manager.component.html',
  styleUrls: ['./feature-toggle-manager.component.scss']
})
export class FeatureToggleManagerComponent implements OnInit {
  features: FeatureToggle[] = [];
  homeFeatures: FeatureToggle[] = [];
  navigationFeatures: FeatureToggle[] = [];
  loading = false;

  constructor(private featureToggleService: FeatureToggleService) {}

  ngOnInit(): void {
    this.loadFeatures();
  }

  loadFeatures(): void {
    this.loading = true;
    this.featureToggleService.getFeatures().subscribe(features => {
      this.features = features;
      this.homeFeatures = features.filter(f => f.section === 'home');
      this.navigationFeatures = features.filter(f => f.section === 'navigation');
      this.loading = false;
    });
  }

  toggleFeature(featureId: string, enabled: boolean): void {
    console.log(`Toggling feature ${featureId} to ${enabled}`);
    
  this.featureToggleService.toggleFeature(featureId, enabled).subscribe(() => {
    this.loadFeatures(); // Or update the UI as needed
  });
}

  updateFeature(featureId: string, enabled: boolean): void {
    this.featureToggleService.updateFeature(featureId, enabled);
  }

  getStatusClass(enabled: boolean): string {
    return enabled ? 'text-success' : 'text-danger';
  }

  getStatusIcon(enabled: boolean): string {
    return enabled ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }

  getStatusText(enabled: boolean): string {
    return enabled ? 'Enabled' : 'Disabled';
  }
}
