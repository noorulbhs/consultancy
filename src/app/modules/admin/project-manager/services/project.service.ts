import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  Project, 
  ProjectStatus, 
  ProjectPriority, 
  ProjectFilters, 
  ProjectSummary,
  TeamMember,
  ExternalTeamMember,
  Milestone,
  MilestoneStatus,
  DocumentType
} from '../models/project.model';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform Development',
      description: 'Full-scale e-commerce platform with payment integration, inventory management, and customer portal.',
      clientName: 'TechCorp Solutions',
      clientEmail: 'contact@techcorp.com',
      clientPhone: '+1-555-0123',
      clientCompany: 'TechCorp Solutions Inc.',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      estimatedBudget: 85000,
      actualBudget: 78000,
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.HIGH,
      progress: 75,
      category: 'Web Development',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe API'],
      projectManager: 'John Smith',
      teamMembers: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@company.com',
          role: 'Project Manager',
          department: 'Development',
          isProjectLead: true,
          allocatedHours: 40,
          hourlyRate: 75,
          joinedDate: new Date('2024-01-15'),
          avatar: ''
        },
        {
          id: '2',
          name: 'Sarah Wilson',
          email: 'sarah@company.com',
          role: 'Frontend Developer',
          department: 'Development',
          isProjectLead: false,
          allocatedHours: 40,
          hourlyRate: 65,
          joinedDate: new Date('2024-01-20'),
          avatar: ''
        }
      ],
      externalTeamMembers: [
        {
          id: '1',
          name: 'Mike Johnson',
          email: 'mike.j@freelancer.com',
          phone: '+1-555-0456',
          company: 'Freelance',
          role: 'UI/UX Designer',
          skills: ['Figma', 'Adobe XD', 'Sketch'],
          hourlyRate: 55,
          contractType: 'freelancer',
          contractStartDate: new Date('2024-02-01'),
          contractEndDate: new Date('2024-05-31'),
          allocatedHours: 20,
          isActive: true,
          paymentTerms: 'Weekly',
          notes: 'Highly experienced in e-commerce design'
        }
      ],
      milestones: [
        {
          id: '1',
          title: 'Project Setup & Planning',
          description: 'Initial project setup, requirements gathering, and technical planning',
          dueDate: new Date('2024-02-15'),
          status: MilestoneStatus.COMPLETED,
          progress: 100,
          assignedTo: ['1', '2'],
          deliverables: ['Project Plan', 'Technical Architecture', 'Design Mockups'],
          actualCompletionDate: new Date('2024-02-10')
        },
        {
          id: '2',
          title: 'Backend Development',
          description: 'API development, database setup, and core functionality',
          dueDate: new Date('2024-04-30'),
          status: MilestoneStatus.IN_PROGRESS,
          progress: 80,
          assignedTo: ['1'],
          deliverables: ['REST APIs', 'Database Schema', 'Authentication System']
        }
      ],
      documents: [],
      notes: [],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'admin',
      updatedBy: 'john.smith'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for inventory management',
      clientName: 'RetailMax Inc.',
      clientEmail: 'projects@retailmax.com',
      clientPhone: '+1-555-0789',
      clientCompany: 'RetailMax Inc.',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-15'),
      estimatedBudget: 120000,
      actualBudget: 115000,
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.MEDIUM,
      progress: 45,
      category: 'Mobile Development',
      technologies: ['React Native', 'Firebase', 'Node.js'],
      projectManager: 'Emily Davis',
      teamMembers: [
        {
          id: '3',
          name: 'Emily Davis',
          email: 'emily@company.com',
          role: 'Project Manager',
          department: 'Development',
          isProjectLead: true,
          allocatedHours: 35,
          hourlyRate: 80,
          joinedDate: new Date('2024-02-01'),
          avatar: ''
        }
      ],
      externalTeamMembers: [],
      milestones: [
        {
          id: '3',
          title: 'App Architecture & Setup',
          description: 'Mobile app framework setup and architecture design',
          dueDate: new Date('2024-03-15'),
          status: MilestoneStatus.COMPLETED,
          progress: 100,
          assignedTo: ['3'],
          deliverables: ['App Structure', 'Development Environment'],
          actualCompletionDate: new Date('2024-03-12')
        }
      ],
      documents: [],
      notes: [],
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'admin',
      updatedBy: 'emily.davis'
    },
    {
      id: '3',
      name: 'Corporate Website Redesign',
      description: 'Complete redesign of corporate website with modern UI/UX and CMS integration',
      clientName: 'GlobalTech Industries',
      clientEmail: 'marketing@globaltech.com',
      clientPhone: '+1-555-0321',
      clientCompany: 'GlobalTech Industries Ltd.',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-01-31'),
      estimatedBudget: 45000,
      actualBudget: 42000,
      status: ProjectStatus.COMPLETED,
      priority: ProjectPriority.MEDIUM,
      progress: 100,
      category: 'Web Development',
      technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
      projectManager: 'David Brown',
      teamMembers: [
        {
          id: '4',
          name: 'David Brown',
          email: 'david@company.com',
          role: 'Project Manager',
          department: 'Development',
          isProjectLead: true,
          allocatedHours: 30,
          hourlyRate: 70,
          joinedDate: new Date('2023-11-01'),
          avatar: ''
        }
      ],
      externalTeamMembers: [],
      milestones: [],
      documents: [],
      notes: [],
      createdAt: new Date('2023-10-25'),
      updatedAt: new Date('2024-02-05'),
      createdBy: 'admin',
      updatedBy: 'david.brown'
    },
    {
      id: '4',
      name: 'Cloud Infrastructure Migration',
      description: 'Migration of legacy systems to AWS cloud infrastructure with enhanced security and scalability',
      clientName: 'DataFlow Corporation',
      clientEmail: 'ops@dataflow.com',
      clientPhone: '+1-555-0654',
      clientCompany: 'DataFlow Corporation',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      estimatedBudget: 180000,
      actualBudget: 165000,
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.HIGH,
      progress: 35,
      category: 'Cloud Services',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      projectManager: 'Alex Thompson',
      teamMembers: [
        {
          id: '5',
          name: 'Alex Thompson',
          email: 'alex@company.com',
          role: 'DevOps Engineer',
          department: 'Infrastructure',
          isProjectLead: true,
          allocatedHours: 40,
          hourlyRate: 85,
          joinedDate: new Date('2024-03-01'),
          avatar: ''
        },
        {
          id: '6',
          name: 'Maria Garcia',
          email: 'maria@company.com',
          role: 'Cloud Architect',
          department: 'Infrastructure',
          isProjectLead: false,
          allocatedHours: 35,
          hourlyRate: 90,
          joinedDate: new Date('2024-03-05'),
          avatar: ''
        }
      ],
      externalTeamMembers: [],
      milestones: [
        {
          id: '4',
          title: 'Infrastructure Assessment',
          description: 'Current system analysis and migration planning',
          dueDate: new Date('2024-04-15'),
          status: MilestoneStatus.IN_PROGRESS,
          progress: 75,
          assignedTo: ['5', '6'],
          deliverables: ['Assessment Report', 'Migration Plan', 'Cost Analysis']
        }
      ],
      documents: [],
      notes: [],
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-03-25'),
      createdBy: 'admin',
      updatedBy: 'alex.thompson'
    },
    {
      id: '5',
      name: 'AI-Powered Analytics Dashboard',
      description: 'Development of machine learning-powered business analytics dashboard with predictive insights',
      clientName: 'InsightTech Solutions',
      clientEmail: 'analytics@insighttech.com',
      clientPhone: '+1-555-0987',
      clientCompany: 'InsightTech Solutions Inc.',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-07-20'),
      estimatedBudget: 95000,
      actualBudget: 88000,
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.MEDIUM,
      progress: 60,
      category: 'Data Science',
      technologies: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
      projectManager: 'Lisa Chen',
      teamMembers: [
        {
          id: '7',
          name: 'Lisa Chen',
          email: 'lisa@company.com',
          role: 'Data Scientist',
          department: 'Analytics',
          isProjectLead: true,
          allocatedHours: 40,
          hourlyRate: 95,
          joinedDate: new Date('2024-01-20'),
          avatar: ''
        }
      ],
      externalTeamMembers: [],
      milestones: [
        {
          id: '5',
          title: 'Data Pipeline Development',
          description: 'Build automated data ingestion and processing pipeline',
          dueDate: new Date('2024-05-15'),
          status: MilestoneStatus.IN_PROGRESS,
          progress: 85,
          assignedTo: ['7'],
          deliverables: ['Data Pipeline', 'ETL Scripts', 'Data Validation']
        }
      ],
      documents: [],
      notes: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-22'),
      createdBy: 'admin',
      updatedBy: 'lisa.chen'
    },
    {
      id: '6',
      name: 'Security Audit & Compliance',
      description: 'Comprehensive security audit and implementation of compliance measures for financial regulations',
      clientName: 'SecureBank Ltd.',
      clientEmail: 'security@securebank.com',
      clientPhone: '+1-555-0246',
      clientCompany: 'SecureBank Ltd.',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-05-15'),
      estimatedBudget: 65000,
      actualBudget: 62000,
      status: ProjectStatus.PLANNING,
      priority: ProjectPriority.HIGH,
      progress: 20,
      category: 'Security',
      technologies: ['Security Tools', 'Compliance Frameworks', 'Audit Systems'],
      projectManager: 'Robert Kim',
      teamMembers: [
        {
          id: '8',
          name: 'Robert Kim',
          email: 'robert@company.com',
          role: 'Security Specialist',
          department: 'Security',
          isProjectLead: true,
          allocatedHours: 40,
          hourlyRate: 100,
          joinedDate: new Date('2024-02-15'),
          avatar: ''
        }
      ],
      externalTeamMembers: [],
      milestones: [],
      documents: [],
      notes: [],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'admin',
      updatedBy: 'robert.kim'
    }
  ];

  private projectsSubject = new BehaviorSubject<Project[]>(this.projects);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private activityTracker: ActivityTrackerService) {}

  getProjects(filters?: ProjectFilters): Observable<Project[]> {
    let filteredProjects = [...this.projects];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredProjects = filteredProjects.filter(p => filters.status!.includes(p.status));
      }
      if (filters.priority && filters.priority.length > 0) {
        filteredProjects = filteredProjects.filter(p => filters.priority!.includes(p.priority));
      }
      if (filters.clientName) {
        filteredProjects = filteredProjects.filter(p => 
          p.clientName.toLowerCase().includes(filters.clientName!.toLowerCase())
        );
      }
      if (filters.projectManager) {
        filteredProjects = filteredProjects.filter(p => 
          p.projectManager.toLowerCase().includes(filters.projectManager!.toLowerCase())
        );
      }
      if (filters.category) {
        filteredProjects = filteredProjects.filter(p => 
          p.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      if (filters.technologies && filters.technologies.length > 0) {
        filteredProjects = filteredProjects.filter(p => 
          filters.technologies!.some(tech => 
            p.technologies.some(pTech => 
              pTech.toLowerCase().includes(tech.toLowerCase())
            )
          )
        );
      }
    }

    return of(filteredProjects).pipe(delay(500));
  }

  getProject(id: string): Observable<Project | null> {
    const project = this.projects.find(p => p.id === id);
    return of(project || null).pipe(delay(300));
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.projects.push(newProject);
    this.projectsSubject.next([...this.projects]);
    
    // Track activity
    this.activityTracker.trackProjectActivity('Created', newProject.name, newProject.projectManager || 'Admin');
    
    return of(newProject).pipe(delay(500));
  }

  updateProject(id: string, updates: Partial<Project>): Observable<Project> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }

    const oldProject = this.projects[index];
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date()
    };

    this.projectsSubject.next([...this.projects]);
    
    // Track activity with specific details about what was updated
    let updateDescription = `${this.projects[index].name} has been updated`;
    if (updates.progress !== undefined && updates.progress !== oldProject.progress) {
      updateDescription = `${this.projects[index].name} progress updated to ${updates.progress}%`;
    } else if (updates.status !== undefined && updates.status !== oldProject.status) {
      updateDescription = `${this.projects[index].name} status changed to ${updates.status}`;
    }
    
    this.activityTracker.trackProjectActivity('Updated', this.projects[index].name, this.projects[index].projectManager || 'Admin', updateDescription);
    
    return of(this.projects[index]).pipe(delay(500));
  }

  deleteProject(id: string): Observable<boolean> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      return of(false);
    }

    const deletedProject = this.projects[index];
    this.projects.splice(index, 1);
    this.projectsSubject.next([...this.projects]);
    
    // Track activity
    this.activityTracker.trackProjectActivity('Deleted', deletedProject.name, deletedProject.projectManager || 'Admin');
    
    return of(true).pipe(delay(300));
  }

  getProjectSummary(): Observable<ProjectSummary> {
    const summary: ProjectSummary = {
      totalProjects: this.projects.length,
      activeProjects: this.projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
      completedProjects: this.projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
      totalBudget: this.projects.reduce((sum, p) => sum + p.estimatedBudget, 0),
      totalActualCost: this.projects.reduce((sum, p) => sum + (p.actualBudget || 0), 0),
      averageProgress: this.projects.reduce((sum, p) => sum + p.progress, 0) / this.projects.length,
      overdueMilestones: this.projects.reduce((count, p) => {
        const overdue = p.milestones.filter(m => 
          m.status !== MilestoneStatus.COMPLETED && 
          new Date(m.dueDate) < new Date()
        ).length;
        return count + overdue;
      }, 0)
    };

    return of(summary).pipe(delay(300));
  }

  getAvailableTeamMembers(): Observable<TeamMember[]> {
    // Mock team members data - in real app, this would come from team service
    const teamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@company.com',
        role: 'Project Manager',
        department: 'Development',
        isProjectLead: false,
        allocatedHours: 40,
        hourlyRate: 75,
        joinedDate: new Date('2023-01-15'),
        avatar: ''
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah@company.com',
        role: 'Frontend Developer',
        department: 'Development',
        isProjectLead: false,
        allocatedHours: 40,
        hourlyRate: 65,
        joinedDate: new Date('2023-02-20'),
        avatar: ''
      },
      {
        id: '3',
        name: 'Emily Davis',
        email: 'emily@company.com',
        role: 'Backend Developer',
        department: 'Development',
        isProjectLead: false,
        allocatedHours: 40,
        hourlyRate: 70,
        joinedDate: new Date('2023-03-10'),
        avatar: ''
      },
      {
        id: '4',
        name: 'David Brown',
        email: 'david@company.com',
        role: 'Full Stack Developer',
        department: 'Development',
        isProjectLead: false,
        allocatedHours: 40,
        hourlyRate: 68,
        joinedDate: new Date('2023-04-05'),
        avatar: ''
      },
      {
        id: '5',
        name: 'Lisa Anderson',
        email: 'lisa@company.com',
        role: 'UI/UX Designer',
        department: 'Design',
        isProjectLead: false,
        allocatedHours: 35,
        hourlyRate: 60,
        joinedDate: new Date('2023-05-12'),
        avatar: ''
      }
    ];

    return of(teamMembers).pipe(delay(300));
  }

  addTeamMemberToProject(projectId: string, teamMember: TeamMember): Observable<Project> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    project.teamMembers.push(teamMember);
    project.updatedAt = new Date();
    
    this.projectsSubject.next([...this.projects]);
    
    // Track activity
    this.activityTracker.trackTeamActivity('Added to Project', teamMember.name, project.projectManager || 'Admin');
    
    return of(project).pipe(delay(300));
  }

  removeTeamMemberFromProject(projectId: string, memberId: string): Observable<Project> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const memberToRemove = project.teamMembers.find(m => m.id === memberId);
    project.teamMembers = project.teamMembers.filter(m => m.id !== memberId);
    project.updatedAt = new Date();
    
    this.projectsSubject.next([...this.projects]);
    
    // Track activity
    if (memberToRemove) {
      this.activityTracker.trackTeamActivity('Removed from Project', memberToRemove.name, project.projectManager || 'Admin');
    }
    
    return of(project).pipe(delay(300));
  }

  addExternalTeamMember(projectId: string, externalMember: ExternalTeamMember): Observable<Project> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    externalMember.id = Date.now().toString();
    project.externalTeamMembers.push(externalMember);
    project.updatedAt = new Date();
    
    this.projectsSubject.next([...this.projects]);
    return of(project).pipe(delay(300));
  }

  removeExternalTeamMember(projectId: string, memberId: string): Observable<Project> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    project.externalTeamMembers = project.externalTeamMembers.filter(m => m.id !== memberId);
    project.updatedAt = new Date();
    
    this.projectsSubject.next([...this.projects]);
    return of(project).pipe(delay(300));
  }
}
