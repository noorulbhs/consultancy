import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, map, tap, catchError, combineLatest } from 'rxjs';
import { 
  DASHBOARD_STATS, 
  RECENT_ACTIVITIES, 
  MONTHLY_CHART_DATA, 
  SERVICE_PERFORMANCE_DATA, 
  QUICK_ACTIONS,
  PERFORMANCE_METRICS,
  ACTIVE_PROJECTS,
  CLIENT_METRICS,
  REVENUE_CHART_DATA,
  DashboardStat,
  ActivityItem,
  ChartData,
  PerformanceMetric,
  ProjectProgress,
  ClientMetric
} from '../mock/admin-dashboard-data';

// Import actual admin services
import { BlogService } from '../blog-manager/services/blog.service';
import { JobService } from '../job-manager/services/job.service';
import { EnquiryService } from '../enquiry-manager/services/enquiry.service';
import { AdminServiceService } from '../services-manager/services/admin-service.service';
import { TeamService } from '../team-manager/services/team.service';
import { TestimonialService } from '../testimonial-manager/services/testimonial.service';
import { ProjectService } from '../project-manager/services/project.service';
import { Project, ProjectStatus } from '../project-manager/models/project.model';
import { ActivityTrackerService } from './activity-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private blogService: BlogService,
    private jobService: JobService,
    private enquiryService: EnquiryService,
    private serviceService: AdminServiceService,
    private teamService: TeamService,
    private testimonialService: TestimonialService,
    private projectService: ProjectService,
    private activityTrackerService: ActivityTrackerService
  ) {}

  getStats(): Observable<DashboardStat[]> {
    // Use combineLatest for real-time updates instead of forkJoin
    return combineLatest({
      blogs: this.blogService.getAll().pipe(
        catchError(error => {
          console.error('Blog service error in stats:', error);
          return of([]);
        })
      ),
      jobs: this.jobService.getAll().pipe(
        catchError(error => {
          console.error('Job service error in stats:', error);
          return of([]);
        })
      ),
      enquiries: this.enquiryService.getAll().pipe(
        catchError(error => {
          console.error('Enquiry service error in stats:', error);
          return of([]);
        })
      ),
      services: this.serviceService.getAll().pipe(
        catchError(error => {
          console.error('Service service error in stats:', error);
          return of([]);
        })
      ),
      team: this.teamService.getAll().pipe(
        catchError(error => {
          console.error('Team service error in stats:', error);
          return of([]);
        })
      ),
      testimonials: this.testimonialService.getAll().pipe(
        catchError(error => {
          console.error('Testimonial service error in stats:', error);
          return of([]);
        })
      ),
      projects: this.projectService.projects$.pipe(
        catchError(error => {
          console.error('Project service error in stats:', error);
          return of([]);
        })
      )
    }).pipe(
      map(data => {
        console.log('Dashboard stats data:', data);
        
        const activeProjects = data.projects.filter(project => 
          project.status === ProjectStatus.ACTIVE || 
          project.status === ProjectStatus.PLANNING
        ).length;
        
        const completedProjects = data.projects.filter(project => 
          project.status === ProjectStatus.COMPLETED
        ).length;

        const unreadEnquiries = data.enquiries.filter(enq => !enq.isRead).length;
        const totalEnquiries = data.enquiries.length;
        const openJobs = data.jobs.filter(job => job.isOpen).length;
        const activeServices = data.services.filter(service => service.status === 'active').length;

        const stats = [
          {
            title: 'Active Projects',
            value: activeProjects,
            change: 18.5,
            changeType: 'increase' as const,
            icon: 'fas fa-project-diagram',
            color: '#6f42c1',
            route: '/admin/project-manager'
          },
          {
            title: 'Completed Projects',
            value: completedProjects,
            change: 12.3,
            changeType: 'increase' as const,
            icon: 'fas fa-check-circle',
            color: '#28a745',
            route: '/admin/project-manager'
          },
          {
            title: 'New Enquiries',
            value: unreadEnquiries,
            change: 18.7,
            changeType: 'increase' as const,
            icon: 'fas fa-envelope',
            color: '#17a2b8',
            route: '/admin/enquiry-manager'
          },
          {
            title: 'Total Enquiries',
            value: totalEnquiries,
            change: 12.8,
            changeType: 'increase' as const,
            icon: 'fas fa-envelope-open',
            color: '#198754',
            route: '/admin/enquiry-manager'
          },
          {
            title: 'Active Services',
            value: activeServices,
            change: 35.2,
            changeType: 'increase' as const,
            icon: 'fas fa-cogs',
            color: '#007bff',
            route: '/admin/services-manager'
          },
          {
            title: 'Blog Posts',
            value: data.blogs.length,
            change: 22.4,
            changeType: 'increase' as const,
            icon: 'fas fa-blog',
            color: '#28a745',
            route: '/admin/blog-manager'
          },
          {
            title: 'Job Openings',
            value: openJobs,
            change: 12.5,
            changeType: 'increase' as const,
            icon: 'fas fa-briefcase',
            color: '#ffc107',
            route: '/admin/job-manager'
          },
          {
            title: 'Team Members',
            value: data.team.length,
            change: 8.3,
            changeType: 'increase' as const,
            icon: 'fas fa-users',
            color: '#6f42c1',
            route: '/admin/team-manager'
          }
        ];
        
        return stats;
      })
    );
  }

  getRecentActivities(): Observable<ActivityItem[]> {
    // First, try to get real activities from the tracker
    return this.activityTrackerService.getActivities().pipe(
      map(trackedActivities => {
        if (trackedActivities.length > 0) {
          // Use real tracked activities if available
          return trackedActivities.slice(0, 6);
        } else {
          // Generate initial activities from current data if no tracked activities exist
          return this.generateInitialActivities();
        }
      }),
      catchError(error => {
        console.error('Error loading recent activities:', error);
        return of(RECENT_ACTIVITIES);
      })
    );
  }

  private generateInitialActivities(): ActivityItem[] {
    const activities: ActivityItem[] = [];

    // Generate some sample activities from current timestamp
    const now = Date.now();
    
    activities.push({
      id: 'init-1',
      type: 'project',
      title: 'Project Created',
      description: 'E-commerce Platform Development project initialized',
      timestamp: new Date(now - 1 * 60 * 60 * 1000), // 1 hour ago
      user: 'Admin',
      status: 'new'
    });

    activities.push({
      id: 'init-2',
      type: 'team',
      title: 'Team Member Added',
      description: 'New team member joined the development team',
      timestamp: new Date(now - 2 * 60 * 60 * 1000), // 2 hours ago
      user: 'Admin',
      status: 'new'
    });

    activities.push({
      id: 'init-3',
      type: 'blog',
      title: 'Blog Post Published',
      description: 'New article about cloud migration strategies',
      timestamp: new Date(now - 4 * 60 * 60 * 1000), // 4 hours ago
      user: 'Admin',
      status: 'published'
    });

    return activities;
  }

  getAllActivities(): Observable<ActivityItem[]> {
    // Return all activities from the tracker
    return this.activityTrackerService.getActivities().pipe(
      map(trackedActivities => {
        if (trackedActivities.length > 0) {
          return trackedActivities;
        } else {
          // Return extended initial activities if no tracked activities exist
          return this.generateExtendedInitialActivities();
        }
      }),
      catchError(error => {
        console.error('Error loading all activities:', error);
        return of(RECENT_ACTIVITIES);
      })
    );
  }

  private generateExtendedInitialActivities(): ActivityItem[] {
    const activities: ActivityItem[] = [];
    const now = Date.now();
    
    // Generate more comprehensive initial activities
    const activityTypes = [
      { type: 'project', title: 'Project Created', desc: 'E-commerce Platform Development initiated' },
      { type: 'team', title: 'Team Member Added', desc: 'Sarah Chen joined as Cloud Solutions Architect' },
      { type: 'blog', title: 'Blog Post Published', desc: 'Cloud Migration Strategies article published' },
      { type: 'job', title: 'Job Position Created', desc: 'Senior Frontend Developer position opened' },
      { type: 'enquiry', title: 'New Enquiry Received', desc: 'Client inquiry about mobile app development' },
      { type: 'service', title: 'Service Updated', desc: 'Cloud consulting service enhanced with new features' },
      { type: 'testimonial', title: 'Testimonial Added', desc: 'New client testimonial from TechCorp Solutions' },
      { type: 'project', title: 'Project Updated', desc: 'Mobile Banking App progress updated to 85%' },
      { type: 'team', title: 'Team Member Updated', desc: 'John Smith promoted to Senior Project Manager' },
      { type: 'blog', title: 'Blog Post Updated', desc: 'DevOps Best Practices article revised' }
    ];

    activityTypes.forEach((activity, index) => {
      activities.push({
        id: `extended-init-${index + 1}`,
        type: activity.type as 'blog' | 'service' | 'enquiry' | 'job' | 'team' | 'testimonial' | 'project',
        title: activity.title,
        description: activity.desc,
        timestamp: new Date(now - (index + 1) * 2 * 60 * 60 * 1000), // 2 hours intervals
        user: 'Admin',
        status: index % 3 === 0 ? 'new' : index % 3 === 1 ? 'updated' : 'published'
      });
    });

    return activities;
  }

  getMonthlyChartData(): Observable<ChartData> {
    return of(MONTHLY_CHART_DATA);
  }

  getServicePerformanceData(): Observable<ChartData> {
    return this.serviceService.getAll().pipe(
      map(services => {
        // Group services by category and count enquiries (mock data for now)
        const categories = [...new Set(services.map(s => s.category))];
        const enquiryCounts = categories.map(cat => 
          Math.floor(Math.random() * 50) + 20 // Mock enquiry counts
        );

        return {
          labels: categories,
          datasets: [
            {
              label: 'Service Enquiries',
              data: enquiryCounts,
              backgroundColor: [
                '#007bff', '#28a745', '#dc3545', '#ffc107', 
                '#17a2b8', '#6f42c1', '#fd7e14', '#20c997'
              ].slice(0, categories.length),
              borderWidth: 0
            }
          ]
        };
      })
    );
  }

  getRevenueChartData(): Observable<ChartData> {
    return of(REVENUE_CHART_DATA);
  }

  getQuickActions(): Observable<any[]> {
    return of(QUICK_ACTIONS);
  }

  getPerformanceMetrics(): Observable<PerformanceMetric[]> {
    return forkJoin({
      enquiries: this.enquiryService.getAll(),
      services: this.serviceService.getAll(),
      testimonials: this.testimonialService.getAll()
    }).pipe(
      map(data => {
        const readEnquiries = data.enquiries.filter(e => e.isRead).length;
        const totalEnquiries = data.enquiries.length;
        const conversionRate = totalEnquiries > 0 ? (readEnquiries / totalEnquiries) * 100 : 0;
        
        const avgTestimonialRating = data.testimonials.length > 0 
          ? data.testimonials.reduce((sum, t) => sum + t.rating, 0) / data.testimonials.length 
          : 0;

        return [
          {
            id: '1',
            title: 'Enquiry Response Rate',
            value: Math.round(conversionRate),
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
            value: Number(avgTestimonialRating.toFixed(1)),
            target: 4.5,
            unit: '/5',
            trend: 'up' as const,
            color: '#007bff',
            icon: 'fas fa-star'
          },
          {
            id: '4',
            title: 'Active Services',
            value: data.services.filter(s => s.status === 'active').length,
            target: data.services.length,
            unit: '',
            trend: 'up' as const,
            color: '#20c997',
            icon: 'fas fa-cogs'
          }
        ];
      })
    );
  }

  getActiveProjects(): Observable<ProjectProgress[]> {
    // Get real project data from ProjectService with real-time updates
    return this.projectService.projects$.pipe(
      map(projects => {
        // Filter for active projects and convert to ProjectProgress format
        const activeProjects = projects.filter(project => 
          project.status === ProjectStatus.ACTIVE || 
          project.status === ProjectStatus.PLANNING
        );
        
        return activeProjects.slice(0, 8).map(project => ({
          id: project.id || '',
          name: project.name,
          client: project.clientName,
          progress: project.progress,
          status: this.mapProjectStatusToDashboard(project.status),
          deadline: project.endDate,
          team: project.teamMembers.map(member => member.name),
          priority: project.priority,
          budget: project.estimatedBudget,
          technologies: project.technologies
        }));
      }),
      catchError(error => {
        console.error('Error loading active projects for dashboard:', error);
        // Fallback to mock data if service fails
        return of(ACTIVE_PROJECTS);
      })
    );
  }

  private mapProjectStatusToDashboard(status: ProjectStatus): 'on-track' | 'delayed' | 'ahead' | 'completed' {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'on-track';
      case ProjectStatus.PLANNING:
        return 'ahead';
      case ProjectStatus.ON_HOLD:
        return 'delayed';
      case ProjectStatus.COMPLETED:
        return 'completed';
      default:
        return 'on-track';
    }
  }

  getClientMetrics(): Observable<ClientMetric> {
    return forkJoin({
      enquiries: this.enquiryService.getAll(),
      testimonials: this.testimonialService.getAll(),
      projects: this.projectService.projects$
    }).pipe(
      map(data => {
        const uniqueCompanies = [...new Set(data.enquiries.map(e => e.company).filter(c => c))];
        const avgRating = data.testimonials.length > 0 
          ? data.testimonials.reduce((sum, t) => sum + t.rating, 0) / data.testimonials.length 
          : 0;

        const activeProjectsCount = data.projects.filter(project => 
          project.status === ProjectStatus.ACTIVE || 
          project.status === ProjectStatus.PLANNING
        ).length;

        const totalClients = Math.max(uniqueCompanies.length, data.projects.length * 0.8);

        return {
          totalClients: Math.round(totalClients) || 128,
          newClients: Math.floor(totalClients * 0.15) || 12,
          retentionRate: 94.5, // Mock retention rate (would need historical data)
          satisfactionScore: Number(avgRating.toFixed(1)) || 4.8,
          activeProjects: activeProjectsCount || 6
        };
      }),
      catchError(error => {
        console.error('Error loading client metrics:', error);
        // Fallback to mock data
        return of({
          totalClients: 128,
          newClients: 12,
          retentionRate: 94.5,
          satisfactionScore: 4.8,
          activeProjects: 6
        });
      })
    );
  }

  getDashboardData(): Observable<any> {
    return forkJoin({
      stats: this.getStats(),
      activities: this.getRecentActivities(),
      monthlyChart: this.getMonthlyChartData(),
      servicePerformance: this.getServicePerformanceData(),
      revenueChart: this.getRevenueChartData(),
      quickActions: this.getQuickActions(),
      performanceMetrics: this.getPerformanceMetrics(),
      activeProjects: this.getActiveProjects(),
      clientMetrics: this.getClientMetrics()
    }).pipe(
      map(data => {
        return data;
      }),
      catchError(error => {
        console.error('Dashboard service error, returning empty data:', error);
        return of({
          stats: [],
          activities: [],
          monthlyChart: {},
          servicePerformance: {},
          revenueChart: {},
          quickActions: [],
          performanceMetrics: [],
          activeProjects: [],
          clientMetrics: {}
        });
      })
    );
  }

  getSystemHealth(): Observable<any> {
    return of({
      serverStatus: 'Online',
      databaseStatus: 'Online',
      backupStatus: 'Completed',
      lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      uptime: '99.98%',
      responseTime: '142ms',
      memoryUsage: 68.5,
      cpuUsage: 23.2,
      diskUsage: 45.8,
      activeUsers: 1247
    });
  }

  getNotifications(): Observable<any[]> {
    return forkJoin({
      enquiries: this.enquiryService.getAll(),
      jobs: this.jobService.getAll()
    }).pipe(
      map(data => {
        const notifications = [];
        
        // Unread enquiries notification
        const unreadEnquiries = data.enquiries.filter(e => !e.isRead);
        if (unreadEnquiries.length > 0) {
          notifications.push({
            id: 'unread-enquiries',
            type: 'warning',
            title: `${unreadEnquiries.length} Unread Enquiries`,
            message: `You have ${unreadEnquiries.length} new contact enquiries that need attention.`,
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            read: false
          });
        }

        // Active job openings notification
        const activeJobs = data.jobs.filter(j => j.isOpen);
        if (activeJobs.length > 0) {
          notifications.push({
            id: 'active-jobs',
            type: 'info',
            title: `${activeJobs.length} Active Job Openings`,
            message: `You currently have ${activeJobs.length} job positions open for applications.`,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true
          });
        }

        // Add some static notifications
        notifications.push(
          {
            id: 'monthly-report',
            type: 'info',
            title: 'Monthly Report Ready',
            message: 'Your monthly analytics report is now available for download.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            read: false
          },
          {
            id: 'maintenance',
            type: 'warning',
            title: 'Scheduled Maintenance',
            message: 'System maintenance scheduled for tonight at 2:00 AM EST.',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
            read: true
          }
        );

        return notifications.slice(0, 5);
      })
    );
  }
}
