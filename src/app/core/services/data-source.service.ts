import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DataSourceConfig {
  useRealData: boolean;
  apiBaseUrl: string;
  environment: 'development' | 'production';
  features: {
    services: boolean;
    testimonials: boolean;
    team: boolean;
    blog: boolean;
    enquiries: boolean;
    siteSettings: boolean;
    dashboard: boolean;
    projects: boolean;
    careers: boolean;
    staticPages: boolean;
    featureToggles: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private readonly CONFIG_KEY = 'dataSourceConfig';
  
  private defaultConfig: DataSourceConfig = {
    useRealData: false, // Start with mock data, can be toggled
    apiBaseUrl: 'http://localhost:8080/api/v1',
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

  private configSubject = new BehaviorSubject<DataSourceConfig>(this.defaultConfig);
  public config$ = this.configSubject.asObservable();

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    const savedConfig = localStorage.getItem(this.CONFIG_KEY);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Merge with default config to ensure new features are included
        const config = { ...this.defaultConfig, ...parsed };
        this.configSubject.next(config);
      } catch (error) {
        console.error('Error loading data source config:', error);
        this.configSubject.next(this.defaultConfig);
      }
    }
  }

  private saveConfig(config: DataSourceConfig): void {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    this.configSubject.next(config);
  }

  // Get current configuration
  getConfig(): DataSourceConfig {
    return this.configSubject.value;
  }

  // Toggle between real and mock data globally
  toggleDataSource(): void {
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      useRealData: !currentConfig.useRealData
    };
    this.saveConfig(newConfig);
  }

  // Enable/disable real data globally
  setUseRealData(useRealData: boolean): void {
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      useRealData
    };
    this.saveConfig(newConfig);
  }

  // Toggle specific feature
  toggleFeature(feature: keyof DataSourceConfig['features']): void {
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      features: {
        ...currentConfig.features,
        [feature]: !currentConfig.features[feature]
      }
    };
    this.saveConfig(newConfig);
  }

  // Enable/disable specific feature
  setFeature(feature: keyof DataSourceConfig['features'], enabled: boolean): void {
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      features: {
        ...currentConfig.features,
        [feature]: enabled
      }
    };
    this.saveConfig(newConfig);
  }

  // Update API base URL
  setApiBaseUrl(url: string): void {
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      apiBaseUrl: url
    };
    this.saveConfig(newConfig);
  }

  // Check if should use real data for specific feature
  shouldUseRealData(feature: keyof DataSourceConfig['features']): boolean {
    const config = this.getConfig();
    return config.useRealData && config.features[feature];
  }

  // Check if should use real data globally
  shouldUseRealDataGlobally(): boolean {
    return this.getConfig().useRealData;
  }

  // Get API base URL
  getApiBaseUrl(): string {
    return this.getConfig().apiBaseUrl;
  }

  // Reset to default configuration
  resetToDefaults(): void {
    this.saveConfig(this.defaultConfig);
  }

  // Enable all features for real data
  enableAllFeatures(): void {
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      useRealData: true,
      features: {
        services: true,
        testimonials: true,
        team: true,
        blog: true,
        enquiries: true,
        siteSettings: true,
        dashboard: true,
        projects: true,
        careers: true,
        staticPages: true,
        featureToggles: true
      }
    };
    this.saveConfig(newConfig);
  }

  // Disable all features (use mock data)
  disableAllFeatures(): void {
    const currentConfig = this.getConfig();
    const newConfig = {
      ...currentConfig,
      useRealData: false,
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
    this.saveConfig(newConfig);
  }
}
