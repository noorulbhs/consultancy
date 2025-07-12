import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TeamMember } from '../../../../core/interfaces/content.interface';
import { HttpService } from '../../../../core/services/http.service';
import { DataSourceService } from '../../../../core/services/data-source.service';
import { PUBLIC_API_ENDPOINTS, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {}

  // Get all team members (public)
  getTeamMembers(): Observable<TeamMember[]> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.getTeamMembersFromAPI();
    } else {
      return this.getTeamMembersFromMock();
    }
  }

  private getTeamMembersFromAPI(): Observable<TeamMember[]> {
    return this.httpService.get<TeamMember[]>(
      PUBLIC_API_ENDPOINTS.TEAM,
      { isPublic: true }
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching team members from API, falling back to mock data:', error);
        return this.getTeamMembersFromMock();
      })
    );
  }

  private getTeamMembersFromMock(): Observable<TeamMember[]> {
    // Import mock data dynamically to avoid circular dependencies
    return import('../mock/team-data').then(module => module.MOCK_TEAM_MEMBERS)
      .then(mockData => of(mockData))
      .catch(() => of([]));
  }

  // Get featured team members
  getFeaturedTeamMembers(): Observable<TeamMember[]> {
    return this.getTeamMembers().pipe(
      map(members => members.filter(member => member.featured && member.isPublic))
    );
  }

  // Get team member by ID
  getTeamMemberById(id: number): Observable<TeamMember | undefined> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.get<TeamMember>(
        PUBLIC_API_ENDPOINTS.TEAM_BY_ID(id),
        { isPublic: true }
      ).pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching team member from API:', error);
          return of(undefined);
        })
      );
    } else {
      return this.getTeamMembers().pipe(
        map(members => members.find(member => member.id === id))
      );
    }
  }

  // Get team members by department
  getTeamMembersByDepartment(department: string): Observable<TeamMember[]> {
    return this.getTeamMembers().pipe(
      map(members => members.filter(member => 
        member.department.toLowerCase() === department.toLowerCase()
      ))
    );
  }

  // Admin functions
  getAllTeamMembers(): Observable<TeamMember[]> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.get<TeamMember[]>(
        ADMIN_API_ENDPOINTS.TEAM,
        { isPublic: false }
      ).pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching all team members:', error);
          return of([]);
        })
      );
    } else {
      return this.getTeamMembersFromMock();
    }
  }

  createTeamMember(teamMember: Partial<TeamMember>): Observable<{ success: boolean; message: string; data?: any }> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.post(
        ADMIN_API_ENDPOINTS.TEAM,
        teamMember,
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Team member created successfully', data: response.data })),
        catchError(error => {
          console.error('Error creating team member:', error);
          return of({ success: false, message: 'Failed to create team member' });
        })
      );
    } else {
      // Mock implementation - in real app, this would be handled differently
      return of({ success: true, message: 'Team member created successfully (mock)' });
    }
  }

  updateTeamMember(id: number, teamMember: Partial<TeamMember>): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.put(
        ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
        teamMember,
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Team member updated successfully' })),
        catchError(error => {
          console.error('Error updating team member:', error);
          return of({ success: false, message: 'Failed to update team member' });
        })
      );
    } else {
      return of({ success: true, message: 'Team member updated successfully (mock)' });
    }
  }

  deleteTeamMember(id: number): Observable<{ success: boolean; message: string }> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.delete(
        ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
        { isPublic: false }
      ).pipe(
        map(response => ({ success: true, message: 'Team member deleted successfully' })),
        catchError(error => {
          console.error('Error deleting team member:', error);
          return of({ success: false, message: 'Failed to delete team member' });
        })
      );
    } else {
      return of({ success: true, message: 'Team member deleted successfully (mock)' });
    }
  }
}
