import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataSourceService } from '../../core/services/data-source.service';
import { HomeService } from '../../modules/public/home/services/home.service';
import { TestimonialService } from '../../modules/public/home/services/testimonial.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { EnquiryService } from '../../core/services/enquiry.service';

@Component({
  selector: 'app-data-integration-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <h2>Data Integration Demo</h2>
      
      <div class="status-bar">
        <div class="status-item" [class.active]="isUsingRealData">
          <span class="status-label">Data Source:</span>
          <span class="status-value">{{ isUsingRealData ? 'Real API' : 'Mock Data' }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">API URL:</span>
          <span class="status-value">{{ apiUrl }}</span>
        </div>
      </div>

      <div class="demo-sections">
        <!-- Services Demo -->
        <div class="demo-section">
          <h3>Services Data</h3>
          <div class="feature-toggle">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="serviceFeatureEnabled"
                (change)="toggleServiceFeature()"
              >
              Use Real Data for Services
            </label>
          </div>
          <button (click)="loadServices()" class="btn btn-primary">Load Services</button>
          <div class="data-display" *ngIf="services.length > 0">
            <div class="data-item" *ngFor="let service of services">
              <h4>{{ service.title || service.name }}</h4>
              <p>{{ service.description }}</p>
              <span class="data-source">
                Source: {{ dataSourceService.shouldUseRealData('services') ? 'API' : 'Mock' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Testimonials Demo -->
        <div class="demo-section">
          <h3>Testimonials Data</h3>
          <div class="feature-toggle">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="testimonialsFeatureEnabled"
                (change)="toggleTestimonialsFeature()"
              >
              Use Real Data for Testimonials
            </label>
          </div>
          <button (click)="loadTestimonials()" class="btn btn-primary">Load Testimonials</button>
          <div class="data-display" *ngIf="testimonials.length > 0">
            <div class="data-item" *ngFor="let testimonial of testimonials">
              <h4>{{ testimonial.name }}</h4>
              <p>{{ testimonial.company }} - {{ testimonial.designation }}</p>
              <p>{{ testimonial.message }}</p>
              <span class="data-source">
                Source: {{ dataSourceService.shouldUseRealData('testimonials') ? 'API' : 'Mock' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Site Settings Demo -->
        <div class="demo-section">
          <h3>Site Settings</h3>
          <div class="feature-toggle">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="settingsFeatureEnabled"
                (change)="toggleSettingsFeature()"
              >
              Use Real Data for Settings
            </label>
          </div>
          <button (click)="loadSettings()" class="btn btn-primary">Load Settings</button>
          <div class="data-display" *ngIf="siteSettings">
            <div class="data-item">
              <h4>{{ siteSettings.companyName }}</h4>
              <p>{{ siteSettings.tagline }}</p>
              <p>{{ siteSettings.description }}</p>
              <span class="data-source">
                Source: {{ dataSourceService.shouldUseRealData('siteSettings') ? 'API' : 'Mock' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Contact Form Demo -->
        <div class="demo-section">
          <h3>Contact Form</h3>
          <div class="feature-toggle">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="enquiriesFeatureEnabled"
                (change)="toggleEnquiriesFeature()"
              >
              Use Real Data for Enquiries
            </label>
          </div>
          <form (ngSubmit)="submitEnquiry()" #enquiryForm="ngForm">
            <div class="form-group">
              <label>Name:</label>
              <input type="text" [(ngModel)]="enquiry.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input type="email" [(ngModel)]="enquiry.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Message:</label>
              <textarea [(ngModel)]="enquiry.message" name="message" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="!enquiryForm.valid">
              Submit Enquiry
            </button>
          </form>
          <div class="result-message" *ngIf="enquiryResult">
            <p [class.success]="enquiryResult.success" [class.error]="!enquiryResult.success">
              {{ enquiryResult.message }}
            </p>
            <span class="data-source">
              Source: {{ dataSourceService.shouldUseRealData('enquiries') ? 'API' : 'Mock' }}
            </span>
          </div>
        </div>
      </div>

      <div class="global-controls">
        <h3>Global Controls</h3>
        <button (click)="enableAllFeatures()" class="btn btn-success">Enable All Real Data</button>
        <button (click)="disableAllFeatures()" class="btn btn-warning">Use Mock Data Only</button>
        <button (click)="resetConfiguration()" class="btn btn-danger">Reset Configuration</button>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .status-bar {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .status-item.active .status-value {
      color: #4CAF50;
      font-weight: bold;
    }

    .status-label {
      font-weight: bold;
      color: #666;
      margin-bottom: 5px;
    }

    .status-value {
      color: #333;
      font-size: 16px;
    }

    .demo-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .demo-section {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
    }

    .demo-section h3 {
      margin-top: 0;
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }

    .feature-toggle {
      margin-bottom: 15px;
    }

    .feature-toggle label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .feature-toggle input {
      margin-right: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin: 5px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #2196F3;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1976D2;
    }

    .btn-success {
      background-color: #4CAF50;
      color: white;
    }

    .btn-success:hover {
      background-color: #45a049;
    }

    .btn-warning {
      background-color: #ff9800;
      color: white;
    }

    .btn-warning:hover {
      background-color: #f57c00;
    }

    .btn-danger {
      background-color: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background-color: #d32f2f;
    }

    .data-display {
      margin-top: 15px;
      max-height: 300px;
      overflow-y: auto;
    }

    .data-item {
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 10px;
      position: relative;
      background: #fafafa;
    }

    .data-item h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .data-item p {
      margin: 5px 0;
      color: #666;
    }

    .data-source {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #2196F3;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group textarea {
      height: 80px;
      resize: vertical;
    }

    .result-message {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      position: relative;
    }

    .result-message.success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .result-message.error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .global-controls {
      text-align: center;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .global-controls h3 {
      margin-top: 0;
      color: #333;
    }

    @media (max-width: 768px) {
      .demo-sections {
        grid-template-columns: 1fr;
      }
      
      .status-bar {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class DataIntegrationDemoComponent implements OnInit {
  isUsingRealData = false;
  apiUrl = '';
  
  serviceFeatureEnabled = false;
  testimonialsFeatureEnabled = false;
  settingsFeatureEnabled = false;
  enquiriesFeatureEnabled = false;

  services: any[] = [];
  testimonials: any[] = [];
  siteSettings: any = null;
  
  enquiry = {
    name: '',
    email: '',
    message: ''
  };
  
  enquiryResult: any = null;

  constructor(
    public dataSourceService: DataSourceService,
    private homeService: HomeService,
    private testimonialService: TestimonialService,
    private siteSettingsService: SiteSettingsService,
    private enquiryService: EnquiryService
  ) {}

  ngOnInit(): void {
    this.dataSourceService.config$.subscribe(config => {
      this.isUsingRealData = config.useRealData;
      this.apiUrl = config.apiBaseUrl;
      this.serviceFeatureEnabled = config.features.services;
      this.testimonialsFeatureEnabled = config.features.testimonials;
      this.settingsFeatureEnabled = config.features.siteSettings;
      this.enquiriesFeatureEnabled = config.features.enquiries;
    });
  }

  toggleServiceFeature(): void {
    this.dataSourceService.setFeature('services', this.serviceFeatureEnabled);
  }

  toggleTestimonialsFeature(): void {
    this.dataSourceService.setFeature('testimonials', this.testimonialsFeatureEnabled);
  }

  toggleSettingsFeature(): void {
    this.dataSourceService.setFeature('siteSettings', this.settingsFeatureEnabled);
  }

  toggleEnquiriesFeature(): void {
    this.dataSourceService.setFeature('enquiries', this.enquiriesFeatureEnabled);
  }

  loadServices(): void {
    this.homeService.getServices().subscribe(
      services => {
        this.services = services;
        console.log('Services loaded:', services);
      },
      error => {
        console.error('Error loading services:', error);
      }
    );
  }

  loadTestimonials(): void {
    this.testimonialService.getTestimonials().subscribe(
      testimonials => {
        this.testimonials = testimonials;
        console.log('Testimonials loaded:', testimonials);
      },
      error => {
        console.error('Error loading testimonials:', error);
      }
    );
  }

  loadSettings(): void {
    this.siteSettingsService.getSettings().subscribe(
      settings => {
        this.siteSettings = settings;
        console.log('Settings loaded:', settings);
      },
      error => {
        console.error('Error loading settings:', error);
      }
    );
  }

  submitEnquiry(): void {
    this.enquiryService.submitEnquiry(this.enquiry).subscribe(
      result => {
        this.enquiryResult = result;
        if (result.success) {
          // Reset form
          this.enquiry = { name: '', email: '', message: '' };
        }
        console.log('Enquiry result:', result);
      },
      error => {
        this.enquiryResult = { success: false, message: 'Failed to submit enquiry' };
        console.error('Error submitting enquiry:', error);
      }
    );
  }

  enableAllFeatures(): void {
    this.dataSourceService.enableAllFeatures();
  }

  disableAllFeatures(): void {
    this.dataSourceService.disableAllFeatures();
  }

  resetConfiguration(): void {
    this.dataSourceService.resetToDefaults();
  }
}
