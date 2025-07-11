import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { AdminServiceService } from '../../services/admin-service.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormValidationService } from '../../../../../core/services/form-validation.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, QuillModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  serviceId: number | null = null;
  showValidationErrors = false;
  
  fieldDisplayNames = {
    'title': 'Service Title',
    'category': 'Category',
    'icon': 'Icon',
    'description': 'Short Description',
    'detailedDescription': 'Detailed Description',
    'features': 'Features'
  };

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      icon: ['code', Validators.required],
      description: ['', Validators.required],
      detailedDescription: ['', Validators.required],
      features: ['', Validators.required],
      technologies: ['', Validators.required],
      duration: ['', Validators.required],
      deliverables: ['', Validators.required],
      caseStudyClient: [''],
      caseStudyChallenge: [''],
      caseStudySolution: [''],
      caseStudyResults: [''],
      featured: [false],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.serviceId = +id;
      this.adminService.getById(this.serviceId).subscribe(service => {
        if (service) {
          this.form.patchValue({
            title: service.title,
            category: service.category,
            icon: service.icon,
            description: service.description,
            detailedDescription: service.detailedDescription,
            features: service.features.join('\n'),
            technologies: service.technologies.join(', '),
            duration: service.duration,
            deliverables: service.deliverables.join('\n'),
            caseStudyClient: service.caseStudy?.client || '',
            caseStudyChallenge: service.caseStudy?.challenge || '',
            caseStudySolution: service.caseStudy?.solution || '',
            caseStudyResults: service.caseStudy?.results || '',
            featured: service.featured,
            status: service.status
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = this.form.value;
    const serviceData = {
      ...formData,
      features: formData.features.split('\n').filter((f: string) => f.trim()),
      technologies: formData.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t),
      deliverables: formData.deliverables.split('\n').filter((d: string) => d.trim()),
      caseStudy: {
        client: formData.caseStudyClient,
        challenge: formData.caseStudyChallenge,
        solution: formData.caseStudySolution,
        results: formData.caseStudyResults
      }
    };

    // Remove the separate case study fields
    delete serviceData.caseStudyClient;
    delete serviceData.caseStudyChallenge;
    delete serviceData.caseStudySolution;
    delete serviceData.caseStudyResults;

    if (this.editMode && this.serviceId !== null) {
      this.adminService.update(this.serviceId, serviceData).subscribe({
        next: () => {
          this.notificationService.success('Success!', 'Service updated successfully');
          this.router.navigate(['/admin-services']);
        },
        error: (error) => {
          this.notificationService.error('Error!', 'Failed to update service. Please try again.');
        }
      });
    } else {
      this.adminService.add(serviceData).subscribe({
        next: () => {
          this.notificationService.success('Success!', 'Service created successfully');
          this.router.navigate(['/admin-services']);
        },
        error: (error) => {
          this.notificationService.error('Error!', 'Failed to create service. Please try again.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin-services']);
  }

  async validateForm(): Promise<void> {
    this.showValidationErrors = true;
    await this.formValidationService.validateForm(this.form, this.fieldDisplayNames);
  }

  hasFieldError(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.form, fieldName, this.showValidationErrors);
  }

  getFieldError(fieldName: string): string {
    return this.formValidationService.getFieldError(this.form, fieldName, this.showValidationErrors, this.fieldDisplayNames);
  }
}
