import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { BlogService } from '../../services/blog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormValidationService } from '../../../../../core/services/form-validation.service';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, QuillModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  blogId: number | null = null;
  editMode = false;
  showValidationErrors = false;
  categories = ['Cloud Computing', 'DevOps', 'Cybersecurity', 'AI & Machine Learning', 'Digital Transformation', 'Software Development'];
  availableTags = ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Security', 'AI', 'ML', 'Strategy', 'Enterprise', 'Automation', 'JavaScript', 'Python', 'React', 'Angular'];
  
  fieldDisplayNames = {
    'title': 'Title',
    'summary': 'Summary',
    'excerpt': 'Excerpt',
    'content': 'Content',
    'category': 'Category',
    'tags': 'Tags',
    'readingTime': 'Reading Time',
    'featuredImage': 'Featured Image',
    'author.name': 'Author Name',
    'author.title': 'Author Title',
    'author.avatar': 'Author Avatar',
    'author.bio': 'Author Bio'
  };

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      tags: [[], Validators.required],
      readingTime: ['', Validators.required],
      featured: [false],
      featuredImage: ['', Validators.required],
      author: this.fb.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
            avatar: [''],
        bio: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.blogId = +id;
      this.blogService.getById(this.blogId).subscribe(blog => {
        // Patch top-level fields
        const { author, ...rest } = blog;
        this.form.patchValue(rest);
        // Patch author group strictly, ensuring all fields are present
        const authorGroup = this.form.get('author');
        if (authorGroup) {
          authorGroup.setValue({
            name: author && typeof author.name === 'string' ? author.name : '',
            title: author && typeof author.title === 'string' ? author.title : '',
            avatar: author && typeof author.avatar === 'string' ? author.avatar : '',
            bio: author && typeof author.bio === 'string' ? author.bio : ''
          });
        }
      });
    }
  }

  async submit() {
    this.showValidationErrors = true;
    if (!(await this.formValidationService.validateForm(this.form, this.fieldDisplayNames))) {
      return;
    }

    const formData = { ...this.form.value };
    
    // Add default values for fields not in form
    if (!this.editMode) {
      formData.views = 0;
      formData.date = new Date().toISOString().split('T')[0];
    }

    if (this.editMode && this.blogId) {
      this.blogService.update(this.blogId, formData).subscribe({
        next: () => {
          this.notificationService.success('Success!', 'Blog post updated successfully');
          this.router.navigate(['/admin-blogs']);
        },
        error: (error) => {
          this.notificationService.error('Error!', 'Failed to update blog post. Please try again.');
        }
      });
    } else {
      this.blogService.add(formData).subscribe({
        next: () => {
          this.notificationService.success('Success!', 'Blog post created successfully');
          this.router.navigate(['/admin-blogs']);
        },
        error: (error) => {
          this.notificationService.error('Error!', 'Failed to create blog post. Please try again.');
        }
      });
    }
  }

  onTagChange(event: any, tag: string) {
    const tags = this.form.get('tags')?.value || [];
    if (event.target.checked) {
      if (!tags.includes(tag)) {
        this.form.patchValue({ tags: [...tags, tag] });
      }
    } else {
      this.form.patchValue({ tags: tags.filter((t: string) => t !== tag) });
    }
  }

  isTagSelected(tag: string): boolean {
    const tags = this.form.get('tags')?.value || [];
    return tags.includes(tag);
  }

  async validateForm() {
    this.showValidationErrors = true;
    await this.formValidationService.validateForm(this.form, this.fieldDisplayNames);
  }

  // Helper method to check if a field should show error styling
  hasFieldError(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.form, fieldName, this.showValidationErrors);
  }

  // Helper method to get field error message
  getFieldError(fieldName: string): string {
    return this.formValidationService.getFieldError(this.form, fieldName, this.showValidationErrors, this.fieldDisplayNames);
  }
}
