import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamService, TeamMember } from '../../../../admin/team-manager/services/team.service';

@Component({
  selector: 'app-featured-team',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-team.component.html',
  styleUrls: ['./featured-team.component.scss']
})
export class FeaturedTeamComponent implements OnInit {
  featuredTeam: TeamMember[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.getALLPublic().subscribe((team: TeamMember[]) => {
      // Get first 3 team members or those marked as featured
      this.featuredTeam = team.filter(member => member.featured).slice(0, 3);
      if (this.featuredTeam.length === 0) {
        this.featuredTeam = team.slice(0, 3);
      }
    });
  }

  getEmailLink(member: TeamMember): string {
    return `mailto:${member.email}`;
  }

  getBio(member: TeamMember): string {
    if (!member.bio) return '';
    return member.bio.length > 120 ? member.bio.slice(0, 120) + '...' : member.bio;
  }

  getTopSkills(member: TeamMember): string[] {
    return member.skills ? member.skills.slice(0, 3) : [];
  }
}
