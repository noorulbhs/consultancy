import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeamService, TeamMember } from '../../services/team.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { FormValidationService } from '../../../../../core/services/form-validation.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  memberId: number | null = null;
  editMode = false;
  previewData: TeamMember | null = null;
  isPreviewMode = false;
  showValidationErrors = false;
  
  fieldDisplayNames = {
    'name': 'Full Name',
    'position': 'Position',
    'department': 'Department',
    'email': 'Email Address',
    'phone': 'Phone Number'
  };
  
  departments = [
    'Technology',
    'Leadership',
    'Business Development',
    'Operations',
    'Marketing',
    'HR',
    'Finance',
    'Quality Assurance',
    'Design',
    'Research & Development'
  ];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private formValidationService: FormValidationService
  ) {
    this.form = this.fb.group({
      // Required fields (marked with * in HTML)
      name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]],
      joinDate: [new Date().toISOString().split('T')[0], Validators.required],
      bio: ['', [Validators.required, Validators.minLength(50)]],
      education: ['', Validators.required],
      skills: ['', Validators.required],
      
      // Optional fields (no * in HTML)
      phone: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      linkedin: ['', [Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/.*$/)]],
      twitter: ['', [Validators.pattern(/^https?:\/\/(www\.)?twitter\.com\/.*$/)]],
      github: ['', [Validators.pattern(/^https?:\/\/(www\.)?github\.com\/.*$/)]],
      achievements: [''],
      languages: [''],
      specializations: [''],
      projects: [''],
      certifications: [''],
      interests: [''],
      workStyle: [''],
      motto: [''],
      
      // Settings
      isAdmin: [false],
      isPublic: [true],
      featured: [false]
    });

    // Subscribe to form changes for live preview
    this.form.valueChanges.subscribe(() => {
      this.updatePreview();
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.memberId = +id;
      this.teamService.getById(this.memberId).subscribe((data) => {
        if (data) {
          this.form.patchValue({
            name: data.name,
            role: data.role,
            department: data.department,
            email: data.email || '',
            phone: data.phone || '',
            linkedin: data.linkedin,
            twitter: data.twitter || '',
            github: data.github || '',
            bio: data.bio || '',
            skills: data.skills ? data.skills.join(', ') : '',
            experience: data.experience || '',
            education: data.education || '',
            location: data.location || '',
            joinDate: data.joinDate || new Date().toISOString().split('T')[0],
            isAdmin: data.isAdmin,
            isPublic: data.isPublic,
            featured: data.featured || false,
            achievements: data.achievements ? data.achievements.join('\n') : '',
            languages: data.languages ? data.languages.join(', ') : '',
            specializations: data.specializations ? data.specializations.join(', ') : '',
            projects: data.projects ? data.projects.join('\n') : '',
            certifications: data.certifications ? data.certifications.join('\n') : '',
            interests: data.interests ? data.interests.join(', ') : '',
            workStyle: data.workStyle || '',
            motto: data.motto || ''
          });
          // Form is loaded, ready to go
        }
      });
    }
    // Initialize preview
    this.updatePreview();
  }

  updatePreview(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.previewData = {
        ...formData,
        id: this.memberId || 0,
        skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
        achievements: formData.achievements ? formData.achievements.split('\n').filter((a: string) => a.trim()) : [],
        languages: formData.languages ? formData.languages.split(',').map((l: string) => l.trim()).filter((l: string) => l) : [],
        specializations: formData.specializations ? formData.specializations.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
        projects: formData.projects ? formData.projects.split('\n').filter((p: string) => p.trim()) : [],
        certifications: formData.certifications ? formData.certifications.split('\n').filter((c: string) => c.trim()) : [],
        interests: formData.interests ? formData.interests.split(',').map((i: string) => i.trim()).filter((i: string) => i) : []
      };
    }
  }

  togglePreview(): void {
    this.isPreviewMode = !this.isPreviewMode;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }
    
    const formData = this.form.value;
    const memberData: TeamMember = {
      ...formData,
      skills: formData.skills ? formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
      achievements: formData.achievements ? formData.achievements.split('\n').filter((a: string) => a.trim()) : [],
      languages: formData.languages ? formData.languages.split(',').map((l: string) => l.trim()).filter((l: string) => l) : [],
      specializations: formData.specializations ? formData.specializations.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
      projects: formData.projects ? formData.projects.split('\n').filter((p: string) => p.trim()) : [],
      certifications: formData.certifications ? formData.certifications.split('\n').filter((c: string) => c.trim()) : [],
      interests: formData.interests ? formData.interests.split(',').map((i: string) => i.trim()).filter((i: string) => i) : [],
      id: this.memberId || 0
    };

    if (this.editMode && this.memberId) {
      this.teamService.update(this.memberId, memberData).subscribe({
        next: (response) => {
          this.notificationService.success('Success!', 'Team member updated successfully');
          this.router.navigate(['/admin-team']);
        },
        error: (error) => {
          console.error('Update error:', error);
          this.notificationService.error('Error!', 'Failed to update team member. Please try again.');
        }
      });
    } else {
      this.teamService.add(memberData).subscribe({
        next: (response) => {
          this.notificationService.success('Success!', 'Team member added successfully');
          this.router.navigate(['/admin-team']);
        },
        error: (error) => {
          console.error('Add error:', error);
          this.notificationService.error('Error!', 'Failed to add team member. Please try again.');
        }
      });
    }
  }

  markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-team']);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  getFieldError(fieldName: string): string {
    return this.formValidationService.getFieldError(this.form, fieldName, this.showValidationErrors, this.fieldDisplayNames);
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.form, fieldName, this.showValidationErrors);
  }

  hasFieldError(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.form, fieldName, this.showValidationErrors);
  }

  async validateForm(): Promise<void> {
    this.showValidationErrors = true;
    await this.formValidationService.validateForm(this.form, this.fieldDisplayNames);
  }
}
