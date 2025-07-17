import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectStatus, ProjectPriority, ProjectFilters, ProjectSummary, TeamMember, ExternalTeamMember } from '../models/project.model';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { HttpService } from '../../../../core/services/http.service';
import { ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private activityTracker: ActivityTrackerService,
    private httpService: HttpService
  ) {}

  getProjects(params?: any): Observable<any> {
    // params: { page, size, ...filters }
    return this.httpService.get(ADMIN_API_ENDPOINTS.PROJECTS, params);
  }

  getProject(id: string): Observable<any> {
    return this.httpService.get(`${ADMIN_API_ENDPOINTS.PROJECTS}/${id}`);
  }

  createProject(project: Partial<Project>): Observable<any> {
    return this.httpService.post(ADMIN_API_ENDPOINTS.PROJECTS, project);
  }

  updateProject(id: string, updates: Partial<Project>): Observable<any> {
    return this.httpService.put(`${ADMIN_API_ENDPOINTS.PROJECTS}/${id}`, updates);
  }

  deleteProject(id: string): Observable<any> {
    return this.httpService.delete(`${ADMIN_API_ENDPOINTS.PROJECTS}/${id}`);
  }

  getProjectSummary(): Observable<any> {
    return this.httpService.get(`${ADMIN_API_ENDPOINTS.PROJECTS}/summary`);
  }

  getAvailableTeamMembers(): Observable<any> {
    // Should call the real team service endpoint
    return this.httpService.get(ADMIN_API_ENDPOINTS.TEAM);
  }

  addTeamMemberToProject(projectId: string, teamMember: TeamMember): Observable<any> {
    return this.httpService.post(`${ADMIN_API_ENDPOINTS.PROJECTS}/${projectId}/team-members`, teamMember);
  }

  removeTeamMemberFromProject(projectId: string, memberId: string): Observable<any> {
    return this.httpService.delete(`${ADMIN_API_ENDPOINTS.PROJECTS}/${projectId}/team-members/${memberId}`);
  }

  addExternalTeamMember(projectId: string, externalMember: ExternalTeamMember): Observable<any> {
    return this.httpService.post(`${ADMIN_API_ENDPOINTS.PROJECTS}/${projectId}/external-team-members`, externalMember);
  }

  removeExternalTeamMember(projectId: string, memberId: string): Observable<any> {
    return this.httpService.delete(`${ADMIN_API_ENDPOINTS.PROJECTS}/${projectId}/external-team-members/${memberId}`);
  }
}
