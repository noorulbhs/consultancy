import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { StaticPageService } from '../../services/static-page.service';
import { QuillModule } from 'ngx-quill';
import { StaticPage } from '../../mock/static-content';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormValidationService } from '../../../../../core/services/form-validation.service';

@Component({
  selector: 'app-static-page-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, QuillModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class StaticPageFormComponent implements OnInit {
  form: FormGroup;
  pageId = '';
  editMode = false;
  loading = true;
  showValidationErrors = false;
  
  fieldDisplayNames = {
    'id': 'Page ID',
    'title': 'Page Title',
    'content': 'Page Content',
    'category': 'Category',
    'status': 'Status'
  };
  
  categories = ['About Us', 'Home Page', 'Contact', 'Legal', 'Services', 'Other'];
  statusOptions = ['published', 'draft'];

  // Quill editor configuration
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: StaticPageService,
    private router: Router,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      status: ['published', Validators.required],
      metaDescription: ['', [Validators.maxLength(160)]],
      keywords: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.editMode = true;
      this.pageId = id;
      this.loadPage(id);
    } else {
      this.editMode = false;
      this.loading = false;
    }
  }

  loadPage(id: string): void {
    this.service.getById(id).subscribe(page => {
      if (!page) {
        this.notificationService.error('Page not found', 'The requested page could not be found in the system.');
        this.router.navigate(['/admin-static-pages']);
        return;
      }

      this.form.patchValue({
        id: page.id,
        title: page.title,
        content: page.content,
        category: page.category,
        status: page.status,
        metaDescription: page.metaDescription || ''
      });

      // Load keywords
      this.clearKeywords();
      if (page.keywords) {
        page.keywords.forEach(keyword => this.addKeyword(keyword));
      }

      this.loading = false;
    });
  }

  get keywords(): FormArray {
    return this.form.get('keywords') as FormArray;
  }

  addKeyword(value: string = ''): void {
    this.keywords.push(this.fb.control(value, Validators.required));
  }

  removeKeyword(index: number): void {
    this.keywords.removeAt(index);
  }

  clearKeywords(): void {
    while (this.keywords.length !== 0) {
      this.keywords.removeAt(0);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.form.value;
    const pageData: Partial<StaticPage> = {
      id: formValue.id,
      title: formValue.title,
      content: formValue.content,
      category: formValue.category,
      status: formValue.status,
      metaDescription: formValue.metaDescription,
      keywords: formValue.keywords.filter((keyword: string) => keyword.trim() !== '')
    };

    if (this.editMode) {
      this.service.update(this.pageId, pageData).subscribe(response => {
        if (response.success) {
          this.notificationService.success('Page Updated', 'Static page has been updated successfully!');
          this.router.navigate(['/admin-static-pages']);
        } else {
          this.notificationService.error('Update Failed', `Error updating page: ${response.message}`);
        }
      });
    } else {
      this.service.create(pageData as Omit<StaticPage, 'lastUpdated'>).subscribe(response => {
        if (response.success) {
          this.notificationService.success('Page Created', 'Static page has been created successfully!');
          this.router.navigate(['/admin-static-pages']);
        } else {
          this.notificationService.error('Creation Failed', `Error creating page: ${response.message}`);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin-static-pages']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for validation
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
