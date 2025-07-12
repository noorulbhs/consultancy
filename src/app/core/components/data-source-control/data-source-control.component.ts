import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataSourceService, DataSourceConfig } from '../../services/data-source.service';

@Component({
  selector: 'app-data-source-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-source-control">
      <div class="control-header">
        <h3>Data Source Configuration</h3>
        <p>Switch between mock data and real API data</p>
      </div>

      <div class="control-section">
        <div class="global-toggle">
          <label class="switch">
            <input 
              type="checkbox" 
              [(ngModel)]="config.useRealData"
              (change)="onGlobalToggle()"
            >
            <span class="slider"></span>
          </label>
          <span class="switch-label">
            Use Real Data: {{ config.useRealData ? 'ON' : 'OFF' }}
          </span>
        </div>

        <div class="api-url-section" *ngIf="config.useRealData">
          <label for="apiUrl">API Base URL:</label>
          <input 
            id="apiUrl"
            type="text" 
            [(ngModel)]="config.apiBaseUrl"
            (blur)="onApiUrlChange()"
            placeholder="http://localhost:8080/api/v1"
          >
        </div>
      </div>

      <div class="features-section" *ngIf="config.useRealData">
        <h4>Feature-specific Settings</h4>
        <div class="feature-grid">
          <div class="feature-item" *ngFor="let feature of featureList">
            <label class="feature-switch">
              <input 
                type="checkbox" 
                [(ngModel)]="config.features[feature.key]"
                (change)="onFeatureToggle(feature.key)"
              >
              <span class="feature-slider"></span>
            </label>
            <div class="feature-info">
              <span class="feature-name">{{ feature.name }}</span>
              <span class="feature-status" [class.active]="config.features[feature.key]">
                {{ config.features[feature.key] ? 'Real Data' : 'Mock Data' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-primary" (click)="enableAllFeatures()">
          Enable All Features
        </button>
        <button class="btn btn-secondary" (click)="disableAllFeatures()">
          Use Mock Data Only
        </button>
        <button class="btn btn-danger" (click)="resetToDefaults()">
          Reset to Defaults
        </button>
      </div>

      <div class="status-section">
        <h4>Current Status</h4>
        <div class="status-info">
          <div class="status-item">
            <span class="status-label">Data Source:</span>
            <span class="status-value" [class.real]="config.useRealData">
              {{ config.useRealData ? 'Real API' : 'Mock Data' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">API URL:</span>
            <span class="status-value">{{ config.apiBaseUrl }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Features Using Real Data:</span>
            <span class="status-value">{{ getEnabledFeaturesCount() }}/{{ featureList.length }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-source-control {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
      font-family: Arial, sans-serif;
    }

    .control-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .control-header h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .control-header p {
      color: #666;
      margin: 0;
    }

    .control-section {
      margin-bottom: 30px;
    }

    .global-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
      margin-right: 15px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .switch-label {
      font-weight: bold;
      color: #333;
    }

    .api-url-section {
      text-align: center;
    }

    .api-url-section label {
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
      color: #333;
    }

    .api-url-section input {
      width: 300px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .features-section {
      margin-bottom: 30px;
    }

    .features-section h4 {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      padding: 15px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }

    .feature-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 24px;
      margin-right: 15px;
    }

    .feature-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .feature-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    .feature-switch input:checked + .feature-slider {
      background-color: #4CAF50;
    }

    .feature-switch input:checked + .feature-slider:before {
      transform: translateX(16px);
    }

    .feature-info {
      flex: 1;
    }

    .feature-name {
      display: block;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .feature-status {
      display: block;
      font-size: 12px;
      color: #666;
    }

    .feature-status.active {
      color: #4CAF50;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 30px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #2196F3;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1976D2;
    }

    .btn-secondary {
      background-color: #9E9E9E;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #757575;
    }

    .btn-danger {
      background-color: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background-color: #d32f2f;
    }

    .status-section {
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }

    .status-section h4 {
      text-align: center;
      color: #333;
      margin-bottom: 15px;
    }

    .status-info {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }

    .status-item {
      text-align: center;
      margin: 10px;
    }

    .status-label {
      display: block;
      font-weight: bold;
      color: #666;
      margin-bottom: 5px;
    }

    .status-value {
      display: block;
      color: #333;
      font-size: 16px;
    }

    .status-value.real {
      color: #4CAF50;
      font-weight: bold;
    }

    @media (max-width: 600px) {
      .data-source-control {
        margin: 10px;
        padding: 15px;
      }
      
      .feature-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .status-info {
        flex-direction: column;
      }
    }
  `]
})
export class DataSourceControlComponent implements OnInit {
  config: DataSourceConfig = {
    useRealData: false,
    apiBaseUrl: '',
    environment: 'development',
    features: {
      services: false,
      testimonials: false,
      team: false,
      blog: false,
      enquiries: false,
      siteSettings: false,
      dashboard: false,
      projects: false,
      careers: false,
      staticPages: false,
      featureToggles: false
    }
  };

  featureList = [
    { key: 'services' as const, name: 'Services' },
    { key: 'testimonials' as const, name: 'Testimonials' },
    { key: 'team' as const, name: 'Team Members' },
    { key: 'blog' as const, name: 'Blog Posts' },
    { key: 'enquiries' as const, name: 'Contact Enquiries' },
    { key: 'siteSettings' as const, name: 'Site Settings' },
    { key: 'dashboard' as const, name: 'Dashboard Analytics' },
    { key: 'projects' as const, name: 'Projects' },
    { key: 'careers' as const, name: 'Career Opportunities' },
    { key: 'staticPages' as const, name: 'Static Pages' },
    { key: 'featureToggles' as const, name: 'Feature Toggles' }
  ];

  constructor(private dataSourceService: DataSourceService) {}

  ngOnInit(): void {
    this.dataSourceService.config$.subscribe(config => {
      this.config = { ...config };
    });
  }

  onGlobalToggle(): void {
    this.dataSourceService.setUseRealData(this.config.useRealData);
  }

  onApiUrlChange(): void {
    this.dataSourceService.setApiBaseUrl(this.config.apiBaseUrl);
  }

  onFeatureToggle(feature: keyof DataSourceConfig['features']): void {
    this.dataSourceService.toggleFeature(feature);
  }

  enableAllFeatures(): void {
    this.dataSourceService.enableAllFeatures();
  }

  disableAllFeatures(): void {
    this.dataSourceService.disableAllFeatures();
  }

  resetToDefaults(): void {
    this.dataSourceService.resetToDefaults();
  }

  getEnabledFeaturesCount(): number {
    return Object.values(this.config.features).filter(Boolean).length;
  }
}
