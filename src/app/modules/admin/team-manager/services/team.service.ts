import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  constructor(
    private activityTracker: ActivityTrackerService,
    private httpService: HttpService
  ) {}

  getAll(): Observable<TeamMember[]> {
    return this.httpService.get<TeamMember[]>(
      ADMIN_API_ENDPOINTS.TEAM,
      { isPublic: false }
    ).pipe(map(response => response.data || []));
  }

  getById(id: number): Observable<TeamMember | undefined> {
    return this.httpService.get<TeamMember>(
      ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
      { isPublic: false }
    ).pipe(map(response => response.data));
  }

  // Get public team members (for public website)
  getPublicMembers(): Observable<TeamMember[]> {
    return this.httpService.get<TeamMember[]>(
      PUBLIC_API_ENDPOINTS.TEAM,
      { isPublic: true }
    ).pipe(map(response => response.data || []));
  }

  // Get featured team members
  getFeaturedMembers(): Observable<TeamMember[]> {
    return this.getPublicMembers().pipe(
      map(members => members.filter(member => member.featured))
    );
  }

  add(data: TeamMember): Observable<TeamMember> {
    return this.httpService.post<TeamMember>(
      ADMIN_API_ENDPOINTS.TEAM,
      data,
      { isPublic: false }
    ).pipe(map(response => {
      this.activityTracker.trackTeamActivity('Added', data.name, 'admin');
      return response.data!;
    }));
  }

  update(id: number, data: TeamMember): Observable<TeamMember> {
    return this.httpService.put<TeamMember>(
      ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
      data,
      { isPublic: false }
    ).pipe(map(response => {
      this.activityTracker.trackTeamActivity('Updated', data.name, 'admin');
      return response.data!;
    }));
  }

  delete(id: number): Observable<void> {
    return this.httpService.delete(
      ADMIN_API_ENDPOINTS.TEAM_BY_ID(id),
      { isPublic: false }
    ).pipe(map(() => {
      this.activityTracker.trackTeamActivity('Deleted', `ID: ${id}`, 'admin');
      return void 0;
    }));
  }

  // getNextId removed: no longer needed with backend-only logic
}
