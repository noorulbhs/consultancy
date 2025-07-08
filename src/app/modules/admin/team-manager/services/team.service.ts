import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_TEAM_MEMBERS } from '../mock/team-data';
import { ActivityTrackerService } from '../../services/activity-tracker.service';

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

  constructor(private activityTracker: ActivityTrackerService) {}

  getAll(): Observable<TeamMember[]> {
    return of(this.members);
  }

  getById(id: number): Observable<TeamMember | undefined> {
    return of(this.members.find(m => m.id === id));
  }

  add(data: TeamMember): Observable<TeamMember> {
    data.id = Date.now();
    this.members.push(data);
    
    // Track activity
    this.activityTracker.trackTeamActivity('Added', data.name, 'Admin');
    
    return of(data);
  }

  update(id: number, data: TeamMember): Observable<TeamMember> {
    const index = this.members.findIndex(m => m.id === id);
    if (index !== -1) {
      this.members[index] = { ...data, id };
      
      // Track activity
      this.activityTracker.trackTeamActivity('Updated', data.name, 'Admin');
      
      return of(this.members[index]);
    }
    throw new Error(`Team member with id ${id} not found`);
  }

  delete(id: number): Observable<void> {
    const memberToDelete = this.members.find(m => m.id === id);
    this.members = this.members.filter(m => m.id !== id);
    
    // Track activity
    if (memberToDelete) {
      this.activityTracker.trackTeamActivity('Removed', memberToDelete.name, 'Admin');
    }
    
    return of();
  }
}
