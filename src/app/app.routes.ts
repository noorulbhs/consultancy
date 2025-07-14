import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/admin/layout/layout.component';
import { PublicLayoutComponent } from './modules/public/layouts/public-layout.component';
import { authGuard } from './auth/gaurd/auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Public routes with layout
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'home', loadComponent: () => import('./modules/public/home/home.component').then(m => m.HomeComponent) },
      { path: 'services', loadComponent: () => import('./modules/public/services/services-page.component').then(m => m.ServicesPageComponent) },
      { path: 'about', loadComponent: () => import('./modules/public/about/about-page.component').then(m => m.AboutPageComponent) },
      { path: 'blog', loadComponent: () => import('./modules/public/blog/blog-page.component').then(m => m.BlogPageComponent) },
      { path: 'careers', loadComponent: () => import('./modules/public/careers/careers-page.component').then(m => m.CareersPageComponent) },
      { path: 'contact', loadComponent: () => import('./modules/public/contact/contact-page.component').then(m => m.ContactPageComponent) },
    ]
  },
  
  // Auth routes without layout
  { path: 'admin-login', loadComponent: () => import('./modules/admin/login/login.component').then(m => m.LoginComponent)},

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
   children: [
    { path: 'admin-dashboard', loadComponent: () => import('./modules/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'admin-feature-toggles', loadComponent: () => import('./modules/admin/feature-toggle-manager/feature-toggle-manager.component').then(m => m.FeatureToggleManagerComponent) },
    { path: 'admin-services', loadComponent: () => import('./modules/admin/services-manager/components/list/list.component').then(m => m.ListComponent) },
    { path: 'admin-services/new', loadComponent: () => import('./modules/admin/services-manager/components/form/form.component').then(m => m.FormComponent) },
    { path: 'admin-services/edit/:id', loadComponent: () => import('./modules/admin/services-manager/components/form/form.component').then(m => m.FormComponent) },
    { path: 'admin-blogs', loadComponent: () => import('./modules/admin/blog-manager/components/list/list.component').then(m => m.ListComponent) },
    { path: 'admin-blogs/new', loadComponent: () => import('./modules/admin/blog-manager/components/form/form.component').then(m => m.FormComponent) },
    { path: 'admin-blogs/edit/:id', loadComponent: () => import('./modules/admin/blog-manager/components/form/form.component').then(m => m.FormComponent) },
    { path: 'admin-jobs', loadComponent: () => import('./modules/admin/job-manager/components/list/list.component').then(m => m.ListComponent)},
    { path: 'admin-jobs/new', loadComponent: () => import('./modules/admin/job-manager/components/form/form.component').then(m => m.JobFormComponent)},
    { path: 'admin-jobs/edit/:id', loadComponent: () => import('./modules/admin/job-manager/components/form/form.component').then(m => m.JobFormComponent)},
    { path: 'admin-enquiries', loadComponent: () => import('./modules/admin/enquiry-manager/components/list/list.component').then(m => m.ListComponent) },
    { path: 'admin-site-settings', loadComponent: () => import('./modules/admin/site-settings/components/form/form.component').then(m => m.SiteSettingsFormComponent)},
    { path: 'admin-team', loadComponent: () => import('./modules/admin/team-manager/components/list/list.component').then(m => m.ListComponent)},
    { path: 'admin-team/new', loadComponent: () => import('./modules/admin/team-manager/components/form/form.component').then(m => m.FormComponent)},
    { path: 'admin-team/edit/:id', loadComponent: () => import('./modules/admin/team-manager/components/form/form.component').then(m => m.FormComponent)},
    { path: 'admin-projects', loadComponent: () => import('./modules/admin/project-manager/components/project-list.component').then(m => m.ProjectListComponent)},
    { path: 'admin-projects/new', loadComponent: () => import('./modules/admin/project-manager/components/project-form.component').then(m => m.ProjectFormComponent)},
    { path: 'admin-projects/edit/:id', loadComponent: () => import('./modules/admin/project-manager/components/project-form.component').then(m => m.ProjectFormComponent)},
    { path: 'admin-projects/view/:id', loadComponent: () => import('./modules/admin/project-manager/components/project-form.component').then(m => m.ProjectFormComponent)},
    { path: 'admin-static/:id', loadComponent: () => import('./modules/admin/static-page-manager/components/form/form.component').then(m => m.StaticPageFormComponent)},
    { path: 'admin-static-pages', loadComponent: () => import('./modules/admin/static-page-manager/components/list/list.component').then(m => m.StaticPageListComponent)},
    { path: 'admin-testimonials', loadComponent: () => import('./modules/admin/testimonial-manager/components/list.component').then(m => m.ListComponent)},
    { path: 'admin-testimonials/new', loadComponent: () => import('./modules/admin/testimonial-manager/components/form.component').then(m => m.FormComponent)},
    { path: 'admin-testimonials/edit/:id', loadComponent: () =>import('./modules/admin/testimonial-manager/components/form.component').then(m => m.FormComponent)}

  ]
  }
];
