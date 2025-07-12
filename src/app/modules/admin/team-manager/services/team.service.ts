import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MOCK_TEAM_MEMBERS } from '../mock/team-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';
import { HttpService } from '../../../../core/services/http.service';
import { DataSourceService } from '../../../../core/services/data-source.service';
import { PUBLIC_API_ENDPOINTS, ADMIN_API_ENDPOINTS } from '../../../../core/constants/api-endpoints';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  linkedin: string;
  twitter?: string;
  github?: string;
  photoUrl: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  location?: string;
  joinDate?: string;
  isAdmin: boolean;
  isPublic: boolean;
  featured?: boolean;
  achievements?: string[];
  languages?: string[];
  specializations?: string[];
  projects?: string[];
  certifications?: string[];
  interests?: string[];
  workStyle?: string;
  motto?: string;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  private members: TeamMember[] = [...MOCK_TEAM_MEMBERS];

  constructor(
    private activityTracker: ActivityTrackerService,
    private httpService: HttpService,
    private dataSourceService: DataSourceService
  ) {}

  getAll(): Observable<TeamMember[]> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.getAllFromAPI();
    } else {
      return this.getAllFromMock();
    }
  }

  private getAllFromAPI(): Observable<TeamMember[]> {
    return this.httpService.get<TeamMember[]>(
      ADMIN_API_ENDPOINTS.TEAM,
      { isPublic: false }
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching team members from API, falling back to mock data:', error);
        return this.getAllFromMock();
      })
    );
  }

  private getAllFromMock(): Observable<TeamMember[]> {
    return of(this.members);
  }

  getById(id: number): Observable<TeamMember | undefined> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.get<TeamMember>(
        ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
        { isPublic: false }
      ).pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching team member from API:', error);
          return of(undefined);
        })
      );
    } else {
      return of(this.members.find(m => m.id === id));
    }
  }

  // Get public team members (for public website)
  getPublicMembers(): Observable<TeamMember[]> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.get<TeamMember[]>(
        PUBLIC_API_ENDPOINTS.TEAM,
        { isPublic: true }
      ).pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching public team members from API:', error);
          return of(this.members.filter(m => m.isPublic));
        })
      );
    } else {
      return of(this.members.filter(m => m.isPublic));
    }
  }

  // Get featured team members
  getFeaturedMembers(): Observable<TeamMember[]> {
    return this.getPublicMembers().pipe(
      map(members => members.filter(member => member.featured))
    );
  }

  add(data: TeamMember): Observable<TeamMember> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.post<TeamMember>(
        ADMIN_API_ENDPOINTS.TEAM,
        data,
        { isPublic: false }
      ).pipe(
        map(response => {
          this.activityTracker.trackTeamActivity('Added', data.name, 'admin');
          return response.data!;
        }),
        catchError(error => {
          console.error('Error adding team member:', error);
          throw error;
        })
      );
    } else {
      const newMember = { ...data, id: this.getNextId() };
      this.members.push(newMember);
      this.activityTracker.trackTeamActivity('Added', data.name, 'admin');
      return of(newMember);
    }
  }

  update(id: number, data: TeamMember): Observable<TeamMember> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.put<TeamMember>(
        ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
        data,
        { isPublic: false }
      ).pipe(
        map(response => {
          this.activityTracker.trackTeamActivity('Updated', data.name, 'admin');
          return response.data!;
        }),
        catchError(error => {
          console.error('Error updating team member:', error);
          throw error;
        })
      );
    } else {
      const index = this.members.findIndex(m => m.id === id);
      if (index !== -1) {
        this.members[index] = { ...data, id };
        this.activityTracker.trackTeamActivity('Updated', data.name, 'admin');
        return of(this.members[index]);
      }
      throw new Error(`Team member with id ${id} not found`);
    }
  }

  delete(id: number): Observable<void> {
    if (this.dataSourceService.shouldUseRealData('team')) {
      return this.httpService.delete(
        ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
        { isPublic: false }
      ).pipe(
        map(() => {
          this.activityTracker.trackTeamActivity('Deleted', `ID: ${id}`, 'admin');
          return void 0;
        }),
        catchError(error => {
          console.error('Error deleting team member:', error);
          throw error;
        })
      );
    } else {
      const memberToDelete = this.members.find(m => m.id === id);
      this.members = this.members.filter(m => m.id !== id);
      if (memberToDelete) {
        this.activityTracker.trackTeamActivity('Deleted', memberToDelete.name, 'admin');
      }
      return of();
    }
  }

  private getNextId(): number {
    return Math.max(...this.members.map(m => m.id), 0) + 1;
  }
}
