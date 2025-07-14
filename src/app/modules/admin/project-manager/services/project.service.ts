import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../../core/services/http.service';
import { buildApiUrl, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
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
  private projectsUrl = buildApiUrl(ADMIN_API_ENDPOINTS.PROJECTS);


  constructor(
    private http: HttpService,
    private activityTracker: ActivityTrackerService
  ) {}

  getProjects(filters?: ProjectFilters): Observable<Project[]> {
    // If filters are provided, add them as query params
    let params: any = {};
    if (filters) {
      if (filters.status && filters.status.length) params.status = filters.status.join(',');
      if (filters.priority && filters.priority.length) params.priority = filters.priority.join(',');
      if (filters.dateRange) {
        params.start = filters.dateRange.start.toISOString();
        params.end = filters.dateRange.end.toISOString();
      }
      if (filters.clientName) params.clientName = filters.clientName;
      if (filters.projectManager) params.projectManager = filters.projectManager;
      if (filters.technologies && filters.technologies.length) params.technologies = filters.technologies.join(',');
      if (filters.category) params.category = filters.category;
    }
    return this.http.get<any>(ADMIN_API_ENDPOINTS.PROJECTS, { params }).pipe(
      map(res => {
        if (res.data && Array.isArray(res.data.content)) return res.data.content;
        return [];
      })
    );
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(ADMIN_API_ENDPOINTS.PROJECT_BY_ID(id)).pipe(
      map(res => res.data!)
    );
  }

  getAvailableTeamMembers(): Observable<TeamMember[]> {
    // Example endpoint, adjust as needed
    return this.http.get<any>('/admin/team').pipe(
      map(res => Array.isArray(res.data?.content) ? res.data.content : [])
    );
  }

  updateProject(id: string, project: Project): Observable<Project> {
    return this.http.put<Project>(ADMIN_API_ENDPOINTS.PROJECT_BY_ID(id), project).pipe(
      map(res => res.data!)
    );
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(ADMIN_API_ENDPOINTS.PROJECTS, project).pipe(
      map(res => res.data!)
    );
  }

  getProjectSummary(): Observable<ProjectSummary> {
    // Example endpoint, adjust as needed
    return this.http.get<ProjectSummary[]>('/admin/projects/summary').pipe(
      map(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data[0]!;
        }
        if (res.data && !Array.isArray(res.data) && typeof res.data === 'object') {
          return res.data as ProjectSummary;
        }
        // fallback: return an empty summary object
        return {
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalBudget: 0,
          totalActualCost: 0,
          averageProgress: 0,
          overdueMilestones: 0
        };
      })
    );
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(ADMIN_API_ENDPOINTS.PROJECT_BY_ID(id)).pipe(
      map(res => res.data!)
    );
  }

  addExternalTeamMember(projectId: string, externalMember: ExternalTeamMember): Observable<Project> {
    // Replace with backend call
    return this.http.post<Project>(`/admin/projects/${projectId}/external-team-members`, externalMember).pipe(
      map(res => res.data!)
    );
  }

  removeExternalTeamMember(projectId: string, memberId: string): Observable<Project> {
    // Replace with backend call
    return this.http.delete<Project>(`/admin/projects/${projectId}/external-team-members/${memberId}`).pipe(
      map(res => res.data!)
    );
  }
}
