// DASHBOARD-SPECIFIC MOCK DATA
// This file contains data that is specific to the dashboard only.
// 
// DATA CONSISTENCY NOTES:
// - Stats (blog count, job count, etc.) are now pulled from actual admin services
// - Recent activities are generated from actual admin data 
// - Performance metrics use real data where applicable
// - Client metrics are calculated from actual enquiry/testimonial data
//
// The following data remains dashboard-specific:
// - MONTHLY_CHART_DATA: Analytics data for charts
// - REVENUE_CHART_DATA: Financial analytics
// - PERFORMANCE_METRICS: Some metrics that are dashboard-specific
// - ACTIVE_PROJECTS: Project management data
// - QUICK_ACTIONS: Dashboard navigation shortcuts
// - System Health data: Infrastructure monitoring
// - Some notifications: System-level alerts

export interface DashboardStat {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  route?: string;
}

export interface ActivityItem {
  id: string;
  type: 'blog' | 'service' | 'enquiry' | 'job' | 'team' | 'testimonial' | 'project';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  status?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface PerformanceMetric {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

export interface ProjectProgress {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'ahead' | 'completed';
  deadline: Date;
  team: string[];
}

export interface ClientMetric {
  totalClients: number;
  newClients: number;
  retentionRate: number;
  satisfactionScore: number;
  activeProjects: number;
}

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    title: 'Total Services',
    value: 12,
    change: 15.3,
    changeType: 'increase',
    icon: 'fas fa-cogs',
    color: '#007bff',
    route: '/admin-services'
  },
  {
    title: 'Blog Posts',
    value: 18,
    change: 22.4,
    changeType: 'increase',
    icon: 'fas fa-blog',
    color: '#28a745',
    route: '/admin-blogs'
  },
  {
    title: 'Job Openings',
    value: 7,
    change: 12.5,
    changeType: 'increase',
    icon: 'fas fa-briefcase',
    color: '#ffc107',
    route: '/admin-jobs'
  },
  {
    title: 'New Enquiries',
    value: 34,
    change: 18.7,
    changeType: 'increase',
    icon: 'fas fa-envelope',
    color: '#17a2b8',
    route: '/admin-enquiries'
  },
  {
    title: 'Team Members',
    value: 25,
    change: 8.3,
    changeType: 'increase',
    icon: 'fas fa-users',
    color: '#6f42c1',
    route: '/admin-team'
  },
  {
    title: 'Testimonials',
    value: 42,
    change: 24.2,
    changeType: 'increase',
    icon: 'fas fa-star',
    color: '#fd7e14',
    route: '/admin-testimonials'
  },
  {
    title: 'Monthly Revenue',
    value: 85000,
    change: 12.8,
    changeType: 'increase',
    icon: 'fas fa-dollar-sign',
    color: '#198754',
    route: '/admin-analytics'
  },
  {
    title: 'Website Traffic',
    value: 12500,
    change: 35.2,
    changeType: 'increase',
    icon: 'fas fa-chart-line',
    color: '#20c997',
    route: '/admin-analytics'
  }
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'blog',
    title: 'New Blog Post Published',
    description: 'AI and Machine Learning in Modern Business published by John Doe',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    user: 'John Doe',
    status: 'published'
  },
  {
    id: '2',
    type: 'enquiry',
    title: 'High Priority Enquiry',
    description: 'Enterprise client TechCorp inquired about digital transformation package',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    user: 'System',
    status: 'pending'
  },
  {
    id: '3',
    type: 'service',
    title: 'Service Package Updated',
    description: 'Cloud Infrastructure service pricing and features updated',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: 'Admin',
    status: 'updated'
  },
  {
    id: '4',
    type: 'job',
    title: 'Job Application Received',
    description: 'Senior DevOps Engineer position received 3 new applications',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    user: 'System',
    status: 'new'
  },
  {
    id: '5',
    type: 'team',
    title: 'Team Achievement',
    description: 'Development team completed cloud migration project 2 days ahead of schedule',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    user: 'Project Manager',
    status: 'completed'
  },
  {
    id: '6',
    type: 'testimonial',
    title: '5-Star Client Review',
    description: 'Excellent testimonial received from DataFlow Solutions for cybersecurity audit',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    user: 'System',
    status: 'approved'
  },
  {
    id: '7',
    type: 'blog',
    title: 'Blog Post Updated',
    description: 'Cybersecurity Best Practices article updated with latest trends',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    user: 'Sarah Williams',
    status: 'updated'
  },
  {
    id: '8',
    type: 'enquiry',
    title: 'Follow-up Enquiry',
    description: 'Previous client InnovateTech requested additional consultation services',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    user: 'System',
    status: 'follow-up'
  },
  {
    id: '9',
    type: 'service',
    title: 'New Service Launched',
    description: 'AI/ML Consulting service officially launched with comprehensive packages',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    user: 'CEO',
    status: 'launched'
  },
  {
    id: '10',
    type: 'team',
    title: 'New Team Lead Appointed',
    description: 'Michael Chen promoted to Lead Data Scientist for AI/ML projects',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    user: 'HR Manager',
    status: 'promoted'
  }
];

export const MONTHLY_CHART_DATA: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'New Enquiries',
      data: [25, 32, 28, 45, 38, 52, 48, 65, 58, 72, 68, 85],
      backgroundColor: 'rgba(23, 162, 184, 0.1)',
      borderColor: 'rgba(23, 162, 184, 1)',
      borderWidth: 3
    },
    {
      label: 'Blog Views (in thousands)',
      data: [8, 12, 15, 22, 18, 28, 25, 35, 32, 42, 38, 48],
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      borderColor: 'rgba(40, 167, 69, 1)',
      borderWidth: 3
    },
    {
      label: 'Project Completions',
      data: [5, 7, 6, 9, 8, 12, 10, 14, 13, 16, 15, 18],
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      borderColor: 'rgba(255, 193, 7, 1)',
      borderWidth: 3
    }
  ]
};

export const SERVICE_PERFORMANCE_DATA: ChartData = {
  labels: ['Cloud Infrastructure', 'Digital Transformation', 'Cybersecurity Audit', 'Data Analytics', 'AI/ML Consulting', 'Web Development'],
  datasets: [
    {
      label: 'Service Enquiries',
      data: [78, 65, 52, 48, 42, 38],
      backgroundColor: [
        '#007bff',
        '#28a745',
        '#dc3545',
        '#ffc107',
        '#17a2b8',
        '#6f42c1'
      ],
      borderWidth: 0
    }
  ]
};

export const QUICK_ACTIONS = [
  {
    title: 'Add New Service',
    description: 'Create a new service offering',
    icon: 'fas fa-plus-circle',
    color: '#007bff',
    route: '/admin-services/new'
  },
  {
    title: 'Write Blog Post',
    description: 'Create a new blog post',
    icon: 'fas fa-edit',
    color: '#28a745',
    route: '/admin-blogs/new'
  },
  {
    title: 'Post Job Opening',
    description: 'Add a new job position',
    icon: 'fas fa-briefcase',
    color: '#ffc107',
    route: '/admin-jobs/new'
  },
  {
    title: 'Add Team Member',
    description: 'Add new team member',
    icon: 'fas fa-user-plus',
    color: '#6f42c1',
    route: '/admin-team/new'
  },
  {
    title: 'Manage Enquiries',
    description: 'Review pending enquiries',
    icon: 'fas fa-envelope-open',
    color: '#17a2b8',
    route: '/admin-enquiries'
  },
  {
    title: 'Site Settings',
    description: 'Update website settings',
    icon: 'fas fa-cog',
    color: '#6c757d',
    route: '/admin-site-settings'
  },
  {
    title: 'Static Pages',
    description: 'Manage static content',
    icon: 'fas fa-file-alt',
    color: '#20c997',
    route: '/admin-static-pages'
  },
  {
    title: 'Testimonials',
    description: 'Manage client reviews',
    icon: 'fas fa-quote-right',
    color: '#fd7e14',
    route: '/admin-testimonials'
  }
];

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: '1',
    title: 'Conversion Rate',
    value: 24.5,
    target: 25.0,
    unit: '%',
    trend: 'up',
    color: '#28a745',
    icon: 'fas fa-percentage'
  },
  {
    id: '2',
    title: 'Avg Response Time',
    value: 2.3,
    target: 2.0,
    unit: 'hours',
    trend: 'down',
    color: '#ffc107',
    icon: 'fas fa-clock'
  },
  {
    id: '3',
    title: 'Client Satisfaction',
    value: 4.8,
    target: 4.5,
    unit: '/5',
    trend: 'up',
    color: '#007bff',
    icon: 'fas fa-star'
  },
  {
    id: '4',
    title: 'Project Success Rate',
    value: 96.2,
    target: 95.0,
    unit: '%',
    trend: 'up',
    color: '#20c997',
    icon: 'fas fa-check-circle'
  }
];

export const ACTIVE_PROJECTS: ProjectProgress[] = [
  {
    id: '1',
    name: 'Cloud Migration - TechCorp',
    client: 'TechCorp Solutions',
    progress: 75,
    status: 'on-track',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    team: ['John Doe', 'Sarah Wilson', 'Mike Chen']
  },
  {
    id: '2',
    name: 'E-commerce Platform - RetailMax',
    client: 'RetailMax Inc.',
    progress: 60,
    status: 'ahead',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    team: ['Emily Rodriguez', 'David Park', 'Lisa Kumar']
  },
  {
    id: '3',
    name: 'Security Audit - FinanceFirst',
    client: 'FinanceFirst Bank',
    progress: 40,
    status: 'delayed',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    team: ['Alex Thompson', 'Maria Garcia']
  },
  {
    id: '4',
    name: 'AI Implementation - DataFlow',
    client: 'DataFlow Analytics',
    progress: 85,
    status: 'on-track',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    team: ['Michael Chen', 'Jennifer Liu', 'Robert Kim']
  }
];

export const CLIENT_METRICS: ClientMetric = {
  totalClients: 128,
  newClients: 12,
  retentionRate: 94.5,
  satisfactionScore: 4.8,
  activeProjects: 24
};

export const REVENUE_CHART_DATA: ChartData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Revenue (in thousands)',
      data: [245, 285, 320, 365],
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      borderColor: 'rgba(40, 167, 69, 1)',
      borderWidth: 3
    },
    {
      label: 'Target (in thousands)',
      data: [250, 280, 310, 350],
      backgroundColor: 'rgba(108, 117, 125, 0.1)',
      borderColor: 'rgba(108, 117, 125, 1)',
      borderWidth: 2
    }
  ]
};
