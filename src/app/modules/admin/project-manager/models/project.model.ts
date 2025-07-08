export interface Project {
  id?: string;
  name: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  startDate: Date;
  endDate: Date;
  estimatedBudget: number;
  actualBudget?: number;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  category: string;
  technologies: string[];
  teamMembers: TeamMember[];
  externalTeamMembers: ExternalTeamMember[];
  projectManager: string;
  milestones: Milestone[];
  documents: ProjectDocument[];
  notes: ProjectNote[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isProjectLead: boolean;
  allocatedHours: number;
  hourlyRate?: number;
  joinedDate: Date;
  avatar?: string;
}

export interface ExternalTeamMember {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: string;
  skills: string[];
  hourlyRate: number;
  contractType: 'freelancer' | 'contractor' | 'agency';
  contractStartDate: Date;
  contractEndDate?: Date;
  allocatedHours: number;
  isActive: boolean;
  paymentTerms?: string;
  notes?: string;
}

export interface Milestone {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  status: MilestoneStatus;
  progress: number;
  assignedTo: string[];
  deliverables: string[];
  actualCompletionDate?: Date;
  notes?: string;
}

export interface ProjectDocument {
  id?: string;
  name: string;
  type: DocumentType;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  version: string;
  description?: string;
}

export interface ProjectNote {
  id?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  isImportant: boolean;
  tags: string[];
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REVIEW = 'review'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled'
}

export enum DocumentType {
  CONTRACT = 'contract',
  PROPOSAL = 'proposal',
  REQUIREMENT = 'requirement',
  DESIGN = 'design',
  INVOICE = 'invoice',
  REPORT = 'report',
  OTHER = 'other'
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  clientName?: string;
  projectManager?: string;
  technologies?: string[];
  category?: string;
}

export interface ProjectSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalActualCost: number;
  averageProgress: number;
  overdueMilestones: number;
}
