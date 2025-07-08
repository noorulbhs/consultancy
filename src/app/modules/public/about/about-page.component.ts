import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService, TeamMember } from '../../admin/team-manager/services/team.service';
import { FeatureToggleService } from '../../admin/services/feature-toggle.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  team: TeamMember[] = [];
  showTeamSection = false;

  constructor(
    private teamService: TeamService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    this.featureToggleService.initializeFromStorage();
    
    // Subscribe to feature toggle changes
    this.featureToggleService.getFeatures().subscribe(() => {
      this.showTeamSection = this.featureToggleService.isFeatureEnabled('featured-team-section');
      
      // Only load team data if the section is enabled
      if (this.showTeamSection) {
        this.loadTeamData();
      }
    });
  }

  private loadTeamData(): void {
    this.teamService.getAll().subscribe((data: TeamMember[]) => {
      this.team = data;
    });
  }
}
