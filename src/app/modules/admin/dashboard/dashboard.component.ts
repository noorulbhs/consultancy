import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { DashboardService } from '../services/dashboard.service';
import { 
  DashboardStat, 
  ActivityItem, 
  ChartData, 
  PerformanceMetric, 
  ProjectProgress, 
  ClientMetric 
} from '../mock/admin-dashboard-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard-enhanced.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-50px)', opacity: 0 }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('{{delay}}ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('gridItemAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('{{delay}}ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  // Expose Math to template
  Math = Math;
  
  stats: DashboardStat[] = [];
  recentActivities: ActivityItem[] = [];
  allActivities: ActivityItem[] = [];
  filteredActivities: ActivityItem[] = [];
  showActivitiesModal = false;
  activitiesFilter = 'all';
  activitiesPage = 1;
  activitiesPerPage = 20;
  totalActivities = 0;
  activitiesSearchTerm = '';
  activitiesViewMode: 'timeline' | 'grid' = 'timeline';
  monthlyChartData: ChartData | null = null;
  servicePerformanceData: ChartData | null = null;
  revenueChartData: ChartData | null = null;
  quickActions: any[] = [];
  performanceMetrics: PerformanceMetric[] = [];
  ongoingProjects: ProjectProgress[] = [];
  clientMetrics: ClientMetric | null = null;
  systemHealth: any = {};
  notifications: any[] = [];
  currentTime = new Date();

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {
    // Initialize quick actions immediately
    this.quickActions = this.getDefaultQuickActions();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.startClock();
    this.startPeriodicRefresh();
  }

  private loadDashboardData(): void {
    console.log('Loading dashboard data...');
    
    // Subscribe to real-time stats from actual admin services
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        console.log('Real-time stats loaded:', stats);
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.setFallbackStats();
      }
    });

    // Subscribe to real-time ongoing projects from project service
    this.dashboardService.getActiveProjects().subscribe({
      next: (projects) => {
        console.log('Real-time projects loaded:', projects);
        this.ongoingProjects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.setFallbackProjects();
      }
    });

    // Subscribe to real-time recent activities from actual services
    this.dashboardService.getRecentActivities().subscribe({
      next: (activities) => {
        console.log('Real-time activities loaded:', activities);
        this.recentActivities = activities;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.setFallbackActivities();
      }
    });

    // Load other dashboard data
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        console.log('Dashboard data loaded:', data);
        this.monthlyChartData = data.monthlyChart;
        this.servicePerformanceData = data.servicePerformance;
        this.revenueChartData = data.revenueChart;
        
        if (data.performanceMetrics && data.performanceMetrics.length > 0) {
          this.performanceMetrics = data.performanceMetrics;
        } else {
          this.performanceMetrics = this.getFallbackPerformanceMetrics();
        }
        
        if (data.clientMetrics) {
          this.clientMetrics = data.clientMetrics;
        }
        
        // Note: Keep using the default quick actions from constructor instead of service data
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.performanceMetrics = this.getFallbackPerformanceMetrics();
      }
    });
    
    // Load notifications
    this.dashboardService.getNotifications().subscribe({
      next: (notifications) => {
        console.log('Notifications loaded:', notifications);
        this.notifications = notifications || [];
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.notifications = [
          {
            id: 'notification-1',
            type: 'warning',
            title: 'Unread Enquiries',
            message: 'You have new contact enquiries that need attention.',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            isRead: false
          },
          {
            id: 'notification-2',
            type: 'info',
            title: 'System Update',
            message: 'Dashboard has been updated with new features.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true
          }
        ];
      }
    });
  }

  private startPeriodicRefresh(): void {
    // Refresh dashboard data every 5 minutes
    setInterval(() => {
      this.refreshDashboard();
    }, 5 * 60 * 1000);
  }
  
  private startClock(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  navigateToRoute(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      blog: 'fas fa-blog',
      service: 'fas fa-cogs',
      enquiry: 'fas fa-envelope',
      job: 'fas fa-briefcase',
      team: 'fas fa-users',
      testimonial: 'fas fa-star',
      project: 'fas fa-project-diagram'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  getActivityColor(type: string): string {
    const colors: { [key: string]: string } = {
      blog: '#667eea',
      service: '#28a745',
      enquiry: '#ffc107',
      job: '#17a2b8',
      team: '#6f42c1',
      testimonial: '#e83e8c',
      project: '#fd7e14',
      default: '#6c757d'
    };
    return colors[type] || colors['default'];
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      published: 'badge bg-success',
      pending: 'badge bg-warning',
      updated: 'badge bg-info',
      new: 'badge bg-primary',
      active: 'badge bg-success',
      approved: 'badge bg-success'
    };
    return classes[status] || 'badge bg-secondary';
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      info: 'fas fa-info-circle text-info',
      warning: 'fas fa-exclamation-triangle text-warning',
      success: 'fas fa-check-circle text-success',
      error: 'fas fa-times-circle text-danger'
    };
    return icons[type] || 'fas fa-bell';
  }

  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  dismissNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  getProjectStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'on-track': 'text-success',
      'ahead': 'text-info',
      'delayed': 'text-warning',
      'completed': 'text-primary'
    };
    return classes[status] || 'text-muted';
  }

  getProjectStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'on-track': 'fas fa-check-circle',
      'ahead': 'fas fa-rocket',
      'delayed': 'fas fa-exclamation-triangle',
      'completed': 'fas fa-trophy'
    };
    return icons[status] || 'fas fa-clock';
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 90) return 'bg-success';
    if (progress >= 70) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
  }

  getTrendIcon(trend: string): string {
    const icons: { [key: string]: string } = {
      'up': 'fas fa-arrow-up text-success',
      'down': 'fas fa-arrow-down text-danger',
      'stable': 'fas fa-minus text-muted'
    };
    return icons[trend] || 'fas fa-minus text-muted';
  }

  formatDaysUntilDeadline(deadline: Date): string {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      return `${diffDays} days left`;
    }
  }

  getHealthStatusClass(value: number, isInverted: boolean = false): string {
    if (isInverted) {
      if (value <= 25) return 'text-success';
      if (value <= 50) return 'text-warning';
      return 'text-danger';
    } else {
      if (value >= 75) return 'text-success';
      if (value >= 50) return 'text-warning';
      return 'text-danger';
    }
  }

  formatMetricValue(value: number, unit: string): string {
    if (unit === '%') {
      return `${value}%`;
    } else if (unit === 'hours') {
      return `${value}h`;
    } else if (unit === '/5') {
      return `${value}/5`;
    }
    return `${value}${unit}`;
  }

  getPercentageWidth(value: number, target: number): number {
    return Math.min((value / target) * 100, 100);
  }

  getPercentageColor(value: number, target: number): string {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return '#28a745';
    if (percentage >= 70) return '#ffc107';
    return '#dc3545';
  }

  getTrendClass(trend: string): string {
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted';
  }

  formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  getOngoingProjectCount(): number {
    return this.ongoingProjects.length;
  }

  getCompletionStatus(progress: number): string {
    if (progress >= 90) return 'Near completion';
    if (progress >= 70) return 'On track';
    if (progress >= 50) return 'In progress';
    if (progress >= 25) return 'Early stage';
    return 'Just started';
  }

  formatStatValue(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  getGradientBackground(color: string): string {
    const gradients: { [key: string]: string } = {
      '#667eea': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '#28a745': 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      '#ffc107': 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
      '#dc3545': 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
      '#17a2b8': 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)',
      '#6f42c1': 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)'
    };
    return gradients[color] || `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`;
  }

  getDefaultQuickActions(): any[] {
    return [
      {
        title: 'Add New Project',
        description: 'Create and manage a new client project',
        icon: 'fas fa-plus',
        color: '#007bff',
        route: '/admin-projects/new'
      },
      {
        title: 'Manage Enquiries',
        description: 'Review and respond to customer enquiries',
        icon: 'fas fa-inbox',
        color: '#28a745',
        route: '/admin-enquiries'
      },
      {
        title: 'Post New Job',
        description: 'Create a new job opening',
        icon: 'fas fa-briefcase',
        color: '#ffc107',
        route: '/admin-jobs/new'
      },
      {
        title: 'Add Team Member',
        description: 'Add a new team member profile',
        icon: 'fas fa-user-plus',
        color: '#dc3545',
        route: '/admin-team/new'
      },
      {
        title: 'Add New Service',
        description: 'Create a new service offering',
        icon: 'fas fa-cogs',
        color: '#6f42c1',
        route: '/admin-services/new'
      },
      {
        title: 'Write New Blog',
        description: 'Create and publish a new blog post',
        icon: 'fas fa-blog',
        color: '#17a2b8',
        route: '/admin-blogs/new'
      },
      {
        title: 'Add Testimonial',
        description: 'Add a new client testimonial',
        icon: 'fas fa-star',
        color: '#e83e8c',
        route: '/admin-testimonials/new'
      },
      {
        title: 'Manage Site Settings',
        description: 'Configure website settings and content',
        icon: 'fas fa-cog',
        color: '#fd7e14',
        route: '/admin-site-settings'
      }
    ];
  }

  private setFallbackStats(): void {
    this.stats = [
      {
        title: 'Total Revenue',
        value: 245000,
        change: 12.5,
        changeType: 'increase' as const,
        icon: 'fas fa-dollar-sign',
        color: '#28a745',
        route: '/admin/projects'
      },
      {
        title: 'Ongoing Projects',
        value: 6,
        change: 11.1,
        changeType: 'increase' as const,
        icon: 'fas fa-tasks',
        color: '#fd7e14',
        route: '/admin/projects'
      },
      {
        title: 'Total Clients',
        value: 156,
        change: 15.2,
        changeType: 'increase' as const,
        icon: 'fas fa-users',
        color: '#6f42c1',
        route: '/admin/enquiry-manager'
      },
      {
        title: 'New Enquiries',
        value: 23,
        change: 4.7,
        changeType: 'increase' as const,
        icon: 'fas fa-envelope',
        color: '#ffc107',
        route: '/admin/enquiry-manager'
      },
      {
        title: 'Completed Projects',
        value: 87,
        change: 22.1,
        changeType: 'increase' as const,
        icon: 'fas fa-check-circle',
        color: '#28a745',
        route: '/admin/projects'
      },
      {
        title: 'Open Job Positions',
        value: 5,
        change: 2.0,
        changeType: 'neutral' as const,
        icon: 'fas fa-briefcase',
        color: '#dc3545',
        route: '/admin/job-manager'
      },
      {
        title: 'Team Members',
        value: 12,
        change: 9.1,
        changeType: 'increase' as const,
        icon: 'fas fa-user-friends',
        color: '#fd7e14',
        route: '/admin/team-manager'
      },
      {
        title: 'Services Offered',
        value: 24,
        change: 5.5,
        changeType: 'increase' as const,
        icon: 'fas fa-cogs',
        color: '#e83e8c',
        route: '/admin/services-manager'
      }
    ];
  }

  private setFallbackProjects(): void {
    this.ongoingProjects = [
      {
        id: '1',
        name: 'E-commerce Platform Redesign',
        client: 'TechCorp Solutions',
        status: 'on-track',
        progress: 75,
        deadline: new Date('2025-08-15'),
        team: ['John Doe', 'Jane Smith', 'Mike Johnson']
      },
      {
        id: '2',
        name: 'Mobile App Development',
        client: 'StartupXYZ',
        status: 'on-track',
        progress: 45,
        deadline: new Date('2025-09-30'),
        team: ['Sarah Wilson', 'Tom Brown']
      },
      {
        id: '3',
        name: 'Legacy System Migration',
        client: 'Enterprise Inc.',
        status: 'delayed',
        progress: 25,
        deadline: new Date('2025-12-01'),
        team: ['Alex Chen', 'Maria Garcia', 'David Kim', 'Lisa Wang']
      },
      {
        id: '4',
        name: 'CRM Integration',
        client: 'SalesForce Pro',
        status: 'ahead',
        progress: 90,
        deadline: new Date('2025-07-25'),
        team: ['Robert Taylor', 'Emma Davis']
      },
      {
        id: '5',
        name: 'AI Chatbot Implementation',
        client: 'CustomerFirst Ltd',
        status: 'on-track',
        progress: 85,
        deadline: new Date('2025-08-10'),
        team: ['James Lee', 'Anna Rodriguez']
      },
      {
        id: '7',
        name: 'Data Analytics Dashboard',
        client: 'InsightCorp',
        status: 'on-track',
        progress: 60,
        deadline: new Date('2025-09-15'),
        team: ['Data Team', 'UI/UX Designer']
      }
    ];
  }

  private setFallbackActivities(): void {
    this.recentActivities = [
      {
        id: '1',
        title: 'New Project Started',
        description: 'E-commerce Platform Redesign project has been initiated',
        type: 'service',
        status: 'new',
        user: 'Project Manager',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '2',
        title: 'New Enquiry Received',
        description: 'Contact form submission from potential client',
        type: 'enquiry',
        status: 'new',
        user: 'System',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Project Milestone Completed',
        description: 'CRM Integration project reached 90% completion',
        type: 'service',
        status: 'updated',
        user: 'Development Team',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '4',
        title: 'New Service Added',
        description: 'AI Consulting Service has been published',
        type: 'service',
        status: 'published',
        user: 'Admin',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ];
    this.allActivities = this.recentActivities; // Initialize all activities
    this.totalActivities = this.allActivities.length; // Set total activities count
    this.applyActivityFilter(); // Apply default filter
  }

  private setFallbackData(): void {
    this.setFallbackStats();
    this.setFallbackProjects();
    this.setFallbackActivities();
    this.quickActions = this.getDefaultQuickActions();
  }

  private getFallbackPerformanceMetrics(): PerformanceMetric[] {
    return [
      {
        id: '1',
        title: 'Enquiry Response Rate',
        value: 95,
        target: 95,
        unit: '%',
        trend: 'up' as const,
        color: '#28a745',
        icon: 'fas fa-percentage'
      },
      {
        id: '2',
        title: 'Avg Response Time',
        value: 2.3,
        target: 2.0,
        unit: 'hours',
        trend: 'down' as const,
        color: '#ffc107',
        icon: 'fas fa-clock'
      },
      {
        id: '3',
        title: 'Client Satisfaction',
        value: 4.8,
        target: 4.5,
        unit: '/5',
        trend: 'up' as const,
        color: '#007bff',
        icon: 'fas fa-star'
      },
      {
        id: '4',
        title: 'Project Success Rate',
        value: 94,
        target: 90,
        unit: '%',
        trend: 'up' as const,
        color: '#20c997',
        icon: 'fas fa-trophy'
      }
    ];
  }

  viewProject(projectId: string): void {
    if (projectId) {
      this.router.navigate(['/admin-projects/view', projectId]);
    }
  }

  // Activities Modal Methods
  openActivitiesModal(): void {
    console.log('Opening activities modal...');
    console.log('Current showActivitiesModal value:', this.showActivitiesModal);
    this.showActivitiesModal = true;
    console.log('showActivitiesModal set to:', this.showActivitiesModal);
    console.log('About to load all activities...');
    this.loadAllActivities();
    console.log('Modal should now be visible!');
  }

  closeActivitiesModal(): void {
    this.showActivitiesModal = false;
    this.activitiesFilter = 'all';
    this.activitiesPage = 1;
  }

  private loadAllActivities(): void {
    console.log('Loading all activities...');
    // Get all activities from the last 30 days from the dashboard service
    this.dashboardService.getAllActivities().subscribe({
      next: (activities: ActivityItem[]) => {
        console.log('All activities loaded:', activities.length, 'activities');
        this.allActivities = activities;
        this.totalActivities = activities.length;
        this.applyActivityFilter();
      },
      error: (error: any) => {
        console.error('Error loading all activities:', error);
        // Use current activities as fallback
        this.allActivities = this.recentActivities;
        this.totalActivities = this.allActivities.length;
        this.applyActivityFilter();
      }
    });
  }

  applyActivityFilter(): void {
    let filtered = [...this.allActivities];

    // Apply search filter
    if (this.activitiesSearchTerm) {
      const searchTerm = this.activitiesSearchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchTerm) ||
        activity.description.toLowerCase().includes(searchTerm) ||
        activity.user.toLowerCase().includes(searchTerm) ||
        activity.type.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    if (this.activitiesFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === this.activitiesFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    this.filteredActivities = filtered;
    this.activitiesPage = 1; // Reset to first page
  }

  // Enhanced activity interaction methods
  refreshActivities(): void {
    this.loadAllActivities();
  }

  clearSearch(): void {
    this.activitiesSearchTerm = '';
    this.applyActivityFilter();
  }

  resetFilters(): void {
    this.activitiesFilter = 'all';
    this.activitiesSearchTerm = '';
    this.activitiesPage = 1;
    this.applyActivityFilter();
  }

  onActivityHover(activity: ActivityItem): void {
    // Add hover effects or tooltips
  }

  onActivityLeave(activity: ActivityItem): void {
    // Remove hover effects
  }

  viewActivityDetails(activity: ActivityItem): void {
    // Navigate to specific activity details or show detailed modal
    console.log('Viewing activity details:', activity);
    // You can implement navigation or detailed view here
  }

  shareActivity(activity: ActivityItem): void {
    // Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: activity.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${activity.title}: ${activity.description}`);
    }
  }

  getActivityStats(): { todayCount: number; thisWeekCount: number } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = this.allActivities.filter(activity => 
      new Date(activity.timestamp) >= today
    ).length;

    const thisWeekCount = this.allActivities.filter(activity => 
      new Date(activity.timestamp) >= thisWeek
    ).length;

    return { todayCount, thisWeekCount };
  }

  getFilterIcon(type: string): string {
    const icons: Record<string, string> = {
      'all': 'fas fa-list',
      'project': 'fas fa-tasks',
      'blog': 'fas fa-blog',
      'enquiry': 'fas fa-envelope',
      'job': 'fas fa-briefcase',
      'service': 'fas fa-cogs',
      'team': 'fas fa-users',
      'testimonial': 'fas fa-quote-right'
    };
    return icons[type] || 'fas fa-circle';
  }

  getActivityGradient(type: string): string {
    const gradients: Record<string, string> = {
      'project': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'blog': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'enquiry': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'job': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'service': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'team': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'testimonial': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    };
    return gradients[type] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-secondary';
    
    const classes: Record<string, string> = {
      'published': 'status-success',
      'approved': 'status-success',
      'active': 'status-success',
      'pending': 'status-warning',
      'updated': 'status-info',
      'read': 'status-info',
      'new': 'status-primary',
      'closed': 'status-secondary'
    };
    return classes[status] || 'status-secondary';
  }

  getStatusIcon(status: string | undefined): string {
    if (!status) return 'fas fa-info-circle';
    
    const icons: Record<string, string> = {
      'published': 'fas fa-check-circle',
      'approved': 'fas fa-thumbs-up',
      'active': 'fas fa-play-circle',
      'pending': 'fas fa-clock',
      'updated': 'fas fa-edit',
      'read': 'fas fa-eye',
      'new': 'fas fa-star',
      'closed': 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-info-circle';
  }

  // Activities Filter Methods
  setActivitiesFilter(filter: string): void {
    this.activitiesFilter = filter;
    this.activitiesPage = 1; // Reset to first page
    this.applyActivityFilter();
  }

  getActivitiesByType(type: string): ActivityItem[] {
    if (type === 'all') {
      return this.allActivities;
    }
    return this.allActivities.filter(activity => activity.type === type);
  }

  // Original pagination methods that were missing
  getTotalPages(): number {
    return Math.ceil(this.filteredActivities.length / this.activitiesPerPage);
  }

  getPaginatedActivities(): ActivityItem[] {
    const startIndex = (this.activitiesPage - 1) * this.activitiesPerPage;
    const endIndex = startIndex + this.activitiesPerPage;
    return this.filteredActivities.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.activitiesPage < this.getTotalPages()) {
      this.activitiesPage++;
    }
  }

  previousPage(): void {
    if (this.activitiesPage > 1) {
      this.activitiesPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.activitiesPage = page;
    }
  }

  getActivityFilterOptions(): { value: string; label: string; count: number }[] {
    const filterCounts = this.allActivities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { value: 'all', label: 'All Activities', count: this.allActivities.length },
      { value: 'project', label: 'Projects', count: filterCounts['project'] || 0 },
      { value: 'blog', label: 'Blogs', count: filterCounts['blog'] || 0 },
      { value: 'enquiry', label: 'Enquiries', count: filterCounts['enquiry'] || 0 },
      { value: 'job', label: 'Jobs', count: filterCounts['job'] || 0 },
      { value: 'service', label: 'Services', count: filterCounts['service'] || 0 },
      { value: 'team', label: 'Team', count: filterCounts['team'] || 0 },
      { value: 'testimonial', label: 'Testimonials', count: filterCounts['testimonial'] || 0 }
    ].filter(option => option.count > 0 || option.value === 'all');
  }

  onPageSizeChange(): void {
    this.activitiesPage = 1;
    this.applyActivityFilter();
  }

  // Enhanced pagination methods
  getStartItemNumber(): number {
    return (this.activitiesPage - 1) * this.activitiesPerPage + 1;
  }

  getEndItemNumber(): number {
    const end = this.activitiesPage * this.activitiesPerPage;
    return Math.min(end, this.filteredActivities.length);
  }

  getVisiblePages(): (number | string)[] {
    const totalPages = Math.ceil(this.filteredActivities.length / this.activitiesPerPage);
    const currentPage = this.activitiesPage;
    const visiblePages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      }
    }

    return visiblePages;
  }

}
