// Site Settings Interface
export interface SiteSettings {
  id?: string;
  version?: string;
  companyName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  social: SocialMedia;
  seo: SeoSettings;
  footer: FooterSettings;
  contactForm: ContactFormSettings;
  statistics: SiteStatistics;
  businessHours?: BusinessHours;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface FooterSettings {
  copyrightText: string;
  quickLinks: QuickLink[];
}

export interface QuickLink {
  title: string;
  url: string;
  enabled?: boolean;
}

export interface ContactFormSettings {
  recipientEmail: string;
  subjectOptions: FormOption[];
  serviceOptions: FormOption[];
}

export interface FormOption {
  value: string;
  label: string;
  enabled: boolean;
}

export interface SiteStatistics {
  projectsCompleted?: StatisticItem;
  clientsSatisfied?: StatisticItem;
  yearsExperience?: StatisticItem;
  teamMembers?: StatisticItem;
}

export interface StatisticItem {
  number: string;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}
