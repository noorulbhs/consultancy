import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';
import { SiteSettings } from '../../mock/settings-data';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormValidationService } from '../../../../../core/services/form-validation.service';

@Component({
  selector: 'app-site-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SiteSettingsFormComponent implements OnInit {
  form!: FormGroup;
  logoPreview: string = '';
  faviconPreview: string = '';
  loading = false;
  activeTab = 'company';
  message = '';
  messageType: 'success' | 'error' | '' = '';
  showValidationErrors = false;

  fieldDisplayNames = {
    'companyName': 'Company Name',
    'tagline': 'Tagline',
    'description': 'Description',
    'logoUrl': 'Logo URL',
    'email': 'Email Address',
    'phone': 'Phone Number',
    'address': 'Address',
    'city': 'City',
    'state': 'State',
    'zipCode': 'ZIP Code',
    'country': 'Country'
  };

  tabs = [
    { id: 'company', label: 'Company Info', icon: 'fas fa-building' },
    { id: 'contact', label: 'Contact Details', icon: 'fas fa-phone' },
    { id: 'social', label: 'Social Media', icon: 'fas fa-share-alt' },
    { id: 'seo', label: 'SEO Settings', icon: 'fas fa-search' },
    { id: 'footer', label: 'Footer Settings', icon: 'fas fa-list' },
    { id: 'general', label: 'General', icon: 'fas fa-cog' }
  ];

  constructor(
    private fb: FormBuilder, 
    private settingsService: SettingsService,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      // Company Information
      companyName: ['', Validators.required],
      tagline: ['', Validators.required],
      description: ['', Validators.required],
      logoUrl: ['', Validators.required],
      faviconUrl: [''],
      
      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      alternatePhone: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', Validators.required],
      
      // Business Hours
      businessHours: this.fb.group({
        monday: ['9:00 AM - 6:00 PM'],
        tuesday: ['9:00 AM - 6:00 PM'],
        wednesday: ['9:00 AM - 6:00 PM'],
        thursday: ['9:00 AM - 6:00 PM'],
        friday: ['9:00 AM - 6:00 PM'],
        saturday: ['10:00 AM - 4:00 PM'],
        sunday: ['Closed']
      }),
      
      // Social Media
      social: this.fb.group({
        linkedin: [''],
        twitter: [''],
        facebook: [''],
        instagram: [''],
        youtube: [''],
        github: ['']
      }),
      
      // SEO Settings
      seo: this.fb.group({
        metaTitle: ['', Validators.required],
        metaDescription: ['', Validators.required],
        keywords: this.fb.array([]),
        googleAnalyticsId: [''],
        facebookPixelId: ['']
      }),
      
      // Footer Settings
      footer: this.fb.group({
        copyrightText: ['', Validators.required],
        quickLinks: this.fb.array([]),
        services: this.fb.array([]),
        aboutLinks: this.fb.array([])
      }),
      
      // Contact Form Settings
      contactForm: this.fb.group({
        recipientEmail: ['', [Validators.required, Validators.email]],
        autoReplyEnabled: [true],
        autoReplySubject: [''],
        autoReplyMessage: ['']
      }),
      
      // General Settings
      maintenanceMode: [false],
      maintenanceMessage: [''],
      theme: ['light'],
      primaryColor: ['#007bff'],
      secondaryColor: ['#6c757d']
    });
  }

  ngOnInit(): void {
    this.loadSettings();
    this.setupImagePreviews();
  }

  private loadSettings(): void {
    this.loading = true;
    this.settingsService.getSettings().subscribe({
      next: (data: SiteSettings) => {
        this.form.patchValue(data);
        this.logoPreview = data.logoUrl;
        this.faviconPreview = data.faviconUrl;
        
        // Set up dynamic arrays
        this.setKeywords(data.seo.keywords || []);
        this.setFooterLinks('quickLinks', data.footer.quickLinks || []);
        this.setFooterLinks('services', data.footer.services || []);
        this.setFooterLinks('aboutLinks', data.footer.aboutLinks || []);
        
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to load settings', 'error');
        this.loading = false;
      }
    });
  }

  private setupImagePreviews(): void {
    this.form.get('logoUrl')?.valueChanges.subscribe(url => {
      this.logoPreview = url;
    });

    this.form.get('faviconUrl')?.valueChanges.subscribe(url => {
      this.faviconPreview = url;
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Keywords management
  get keywords(): FormArray {
    return this.form.get('seo.keywords') as FormArray;
  }

  setKeywords(keywords: string[]): void {
    const keywordFormArray = this.fb.array(
      keywords.map(keyword => this.fb.control(keyword, Validators.required))
    );
    this.form.setControl('seo.keywords', keywordFormArray);
  }

  addKeyword(): void {
    this.keywords.push(this.fb.control('', Validators.required));
  }

  removeKeyword(index: number): void {
    this.keywords.removeAt(index);
  }

  // Footer links management
  getFooterLinks(type: string): FormArray {
    return this.form.get(`footer.${type}`) as FormArray;
  }

  setFooterLinks(type: string, links: Array<{title: string, url: string}>): void {
    const linkFormArray = this.fb.array(
      links.map(link => this.fb.group({
        title: [link.title, Validators.required],
        url: [link.url, Validators.required]
      }))
    );
    this.form.setControl(`footer.${type}`, linkFormArray);
  }

  addFooterLink(type: string): void {
    const linksArray = this.getFooterLinks(type);
    linksArray.push(this.fb.group({
      title: ['', Validators.required],
      url: ['', Validators.required]
    }));
  }

  removeFooterLink(type: string, index: number): void {
    this.getFooterLinks(type).removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      this.showMessage('Please fill in all required fields', 'error');
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    // Validate settings
    const validation = this.settingsService.validateSettings(formValue);
    if (!validation.isValid) {
      this.showMessage(validation.errors.join(', '), 'error');
      this.loading = false;
      return;
    }

    this.settingsService.updateSettings(formValue).subscribe({
      next: (response) => {
        this.showMessage(response.message, response.success ? 'success' : 'error');
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to update settings', 'error');
        this.loading = false;
      }
    });
  }

  onReset(): void {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      this.loading = true;
      this.settingsService.resetSettings().subscribe({
        next: (response) => {
          this.showMessage(response.message, 'success');
          this.loadSettings();
        },
        error: () => {
          this.showMessage('Failed to reset settings', 'error');
          this.loading = false;
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.form, fieldName, this.showValidationErrors);
  }

  hasFieldError(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.form, fieldName, this.showValidationErrors);
  }

  getFieldError(fieldName: string): string {
    return this.formValidationService.getFieldError(this.form, fieldName, this.showValidationErrors, this.fieldDisplayNames);
  }

  async validateForm(): Promise<void> {
    this.showValidationErrors = true;
    await this.formValidationService.validateForm(this.form, this.fieldDisplayNames);
  }
}
