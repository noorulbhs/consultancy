import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { FormValidationService } from '../../../../core/services/form-validation.service';
import { 
  Project, 
  ProjectStatus, 
  ProjectPriority, 
  TeamMember, 
  ExternalTeamMember,
  Milestone,
  MilestoneStatus 
} from '../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  teamMemberForm!: FormGroup;
  externalMemberForm!: FormGroup;
  milestoneForm!: FormGroup;
  
  isEditMode = false;
  projectId: string | null = null;
  loading = false;
  saving = false;
  error: string | null = null;
  showValidationErrors = false;
  
  availableTeamMembers: TeamMember[] = [];
  selectedTeamMembers: TeamMember[] = [];
  externalTeamMembers: ExternalTeamMember[] = [];
  milestones: Milestone[] = [];
  
  statusOptions = Object.values(ProjectStatus);
  priorityOptions = Object.values(ProjectPriority);
  milestoneStatusOptions = Object.values(MilestoneStatus);
  contractTypes = ['freelancer', 'contractor', 'agency'];
  
  activeTab = 'basic';
  showTeamMemberModal = false;
  showExternalMemberModal = false;
  showMilestoneModal = false;
  
  fieldDisplayNames = {
    'name': 'Project Name',
    'description': 'Project Description',
    'clientName': 'Client Name',
    'clientEmail': 'Client Email',
    'clientPhone': 'Client Phone',
    'clientCompany': 'Client Company',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'estimatedBudget': 'Estimated Budget',
    'actualBudget': 'Actual Budget',
    'status': 'Status',
    'priority': 'Priority',
    'progress': 'Progress',
    'category': 'Category',
    'projectManager': 'Project Manager'
  };
  
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private formValidationService: FormValidationService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;
    
    this.loadAvailableTeamMembers();
    
    if (this.isEditMode && this.projectId) {
      this.loadProject(this.projectId);
    }
  }

  initializeForms(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: [''],
      clientCompany: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      estimatedBudget: [0, [Validators.required, Validators.min(0)]],
      actualBudget: [0, Validators.min(0)],
      status: [ProjectStatus.PLANNING, Validators.required],
      priority: [ProjectPriority.MEDIUM, Validators.required],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      category: ['', Validators.required],
      technologies: this.fb.array([]),
      projectManager: ['', Validators.required]
    });

    this.teamMemberForm = this.fb.group({
      memberId: ['', Validators.required],
      allocatedHours: [40, [Validators.required, Validators.min(1)]],
      isProjectLead: [false]
    });

    this.externalMemberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      role: ['', Validators.required],
      skills: [''],
      hourlyRate: [0, [Validators.required, Validators.min(0)]],
      contractType: ['freelancer', Validators.required],
      contractStartDate: ['', Validators.required],
      contractEndDate: [''],
      allocatedHours: [20, [Validators.required, Validators.min(1)]],
      paymentTerms: [''],
      notes: ['']
    });

    this.milestoneForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: [MilestoneStatus.NOT_STARTED, Validators.required],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      assignedTo: [[]],
      deliverables: ['']
    });
  }

  loadProject(id: string): void {
    this.loading = true;
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        if (project) {
          this.populateForm(project);
          this.selectedTeamMembers = [...project.teamMembers];
          this.externalTeamMembers = [...project.externalTeamMembers];
          this.milestones = [...project.milestones];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load project';
        this.loading = false;
        console.error('Error loading project:', error);
      }
    });
  }

  loadAvailableTeamMembers(): void {
    this.projectService.getAvailableTeamMembers().subscribe({
      next: (members) => {
        this.availableTeamMembers = members;
      },
      error: (error) => {
        console.error('Error loading team members:', error);
      }
    });
  }

  populateForm(project: Project): void {
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      clientName: project.clientName,
      clientEmail: project.clientEmail,
      clientPhone: project.clientPhone,
      clientCompany: project.clientCompany,
      startDate: this.formatDateForInput(project.startDate),
      endDate: this.formatDateForInput(project.endDate),
      estimatedBudget: project.estimatedBudget,
      actualBudget: project.actualBudget,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      category: project.category,
      projectManager: project.projectManager
    });

    // Set technologies
    const technologiesArray = this.projectForm.get('technologies') as FormArray;
    technologiesArray.clear();
    project.technologies.forEach(tech => {
      technologiesArray.push(this.fb.control(tech));
    });
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  get technologiesArray(): FormArray {
    return this.projectForm.get('technologies') as FormArray;
  }

  addTechnology(): void {
    this.technologiesArray.push(this.fb.control(''));
  }

  removeTechnology(index: number): void {
    this.technologiesArray.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    this.showValidationErrors = true;
    if (!(await this.formValidationService.validateForm(this.projectForm, this.fieldDisplayNames))) {
      return;
    }
    
    this.saving = true;
    this.error = null;

      const formValue = this.projectForm.value;
      const projectData = {
        ...formValue,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        teamMembers: this.selectedTeamMembers,
        externalTeamMembers: this.externalTeamMembers,
        milestones: this.milestones,
        documents: [],
        notes: []
      };

      const operation = this.isEditMode && this.projectId
        ? this.projectService.updateProject(this.projectId, projectData)
        : this.projectService.createProject(projectData);

      operation.subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/admin-projects']);
        },
        error: (error) => {
          this.error = 'Failed to save project';
          this.saving = false;
          console.error('Error saving project:', error);
        }
      });
  }

  async validateForm() {
    this.showValidationErrors = true;
    await this.formValidationService.validateForm(this.projectForm, this.fieldDisplayNames);
  }

  // Helper method to check if a field should show error styling
  hasFieldError(fieldName: string): boolean {
    return this.formValidationService.hasFieldError(this.projectForm, fieldName, this.showValidationErrors);
  }

  // Helper method to get field error message
  getFieldError(fieldName: string): string {
    return this.formValidationService.getFieldError(this.projectForm, fieldName, this.showValidationErrors, this.fieldDisplayNames);
  }

  // Team Member Management
  addTeamMember(): void {
    if (this.teamMemberForm.valid) {
      const formValue = this.teamMemberForm.value;
      const member = this.availableTeamMembers.find(m => m.id === formValue.memberId);
      
      if (member && !this.selectedTeamMembers.find(m => m.id === member.id)) {
        const teamMember: TeamMember = {
          ...member,
          allocatedHours: formValue.allocatedHours,
          isProjectLead: formValue.isProjectLead,
          joinedDate: new Date()
        };
        
        this.selectedTeamMembers.push(teamMember);
        this.teamMemberForm.reset();
        this.showTeamMemberModal = false;
      }
    }
  }

  removeTeamMember(memberId: string): void {
    this.selectedTeamMembers = this.selectedTeamMembers.filter(m => m.id !== memberId);
  }

  // External Team Member Management
  addExternalMember(): void {
    if (this.externalMemberForm.valid) {
      const formValue = this.externalMemberForm.value;
      const externalMember: ExternalTeamMember = {
        ...formValue,
        id: Date.now().toString(),
        skills: formValue.skills ? formValue.skills.split(',').map((s: string) => s.trim()) : [],
        contractStartDate: new Date(formValue.contractStartDate),
        contractEndDate: formValue.contractEndDate ? new Date(formValue.contractEndDate) : undefined,
        isActive: true
      };
      
      this.externalTeamMembers.push(externalMember);
      this.externalMemberForm.reset();
      this.showExternalMemberModal = false;
    }
  }

  removeExternalMember(memberId: string): void {
    this.externalTeamMembers = this.externalTeamMembers.filter(m => m.id !== memberId);
  }

  // Milestone Management
  addMilestone(): void {
    if (this.milestoneForm.valid) {
      const formValue = this.milestoneForm.value;
      const milestone: Milestone = {
        ...formValue,
        id: Date.now().toString(),
        dueDate: new Date(formValue.dueDate),
        deliverables: formValue.deliverables ? formValue.deliverables.split(',').map((d: string) => d.trim()) : []
      };
      
      this.milestones.push(milestone);
      this.milestoneForm.reset();
      this.showMilestoneModal = false;
    }
  }

  removeMilestone(milestoneId: string): void {
    this.milestones = this.milestones.filter(m => m.id !== milestoneId);
  }

  // Utility Methods
  getFormControl(name: string) {
    return this.projectForm.get(name);
  }

  isFieldInvalid(name: string): boolean {
    const field = this.getFormControl(name);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  cancel(): void {
    this.router.navigate(['/admin-projects']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isAnyModalOpen(): boolean {
    return this.showTeamMemberModal || this.showExternalMemberModal || this.showMilestoneModal;
  }

  getExternalTeamCost(): number {
    return this.externalTeamMembers.reduce((sum, member) => sum + (member.hourlyRate * member.allocatedHours * 4), 0);
  }

  isTeamMemberSelected(memberId: string): boolean {
    return this.selectedTeamMembers.some(m => m.id === memberId);
  }
}
