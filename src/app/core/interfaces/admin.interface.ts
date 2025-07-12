// Project Interface
export interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  actualBudget?: number;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  progress: number;
  category: string;
  technologies: string[];
  projectManager: string;
  teamMembers: ProjectTeamMember[];
  milestones: Milestone[];
  documents: Document[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
  role: string;
  allocatedHours: number;
  hourlyRate: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  completedDate?: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  uploadedAt: string;
}

// Dashboard Interface
export interface DashboardMetrics {
  overview: OverviewMetrics;
  recentActivities: Activity[];
  monthlyStats: MonthlyStats;
  topServices: TopService[];
}

export interface OverviewMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  totalClients: number;
  teamMembers: number;
  monthlyRevenue: number;
  clientSatisfaction: number;
}

export interface Activity {
  id: number;
  type: string;
  action: string;
  description: string;
  details?: any;
  user: string;
  userRole?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface MonthlyStats {
  enquiries: MonthlyData[];
  projects: MonthlyData[];
  revenue: MonthlyRevenueData[];
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface MonthlyRevenueData {
  month: string;
  amount: number;
}

export interface TopService {
  name: string;
  requests: number;
}

// Feature Toggle Interface
export interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  section: string;
  updatedAt?: string;
  updatedBy?: string;
}
