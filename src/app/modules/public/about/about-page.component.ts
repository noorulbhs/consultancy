import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService, TeamMember } from '../../admin/team-manager/services/team.service';
import { FeatureToggleService } from '../../public/featuretoggle.service';
import { StaticPageService } from '../../admin/static-page-manager/services/static-page.service';

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
  aboutStory = '';
  aboutVision = '';
  aboutMission = '';

  constructor(
    private teamService: TeamService,
    private featureToggleService: FeatureToggleService,
    private staticPageService: StaticPageService
  ) {}

  ngOnInit(): void {
    // Load static page content
    this.staticPageService.getContent('about-story').subscribe(content => this.aboutStory = content);
    this.staticPageService.getContent('about-vision').subscribe(content => this.aboutVision = content);
    this.staticPageService.getContent('about-mission').subscribe(content => this.aboutMission = content);
    
    // Subscribe to feature toggle changes
    this.featureToggleService.getFeatureToggles().subscribe(() => {
      const toggles = this.featureToggleService.latestToggles || {};
      this.showTeamSection = !!toggles['featured-team-section'];
      if (this.showTeamSection) {
        this.loadTeamData();
      }
    });
  }

  private loadTeamData(): void {
    this.teamService.getALLPublic().subscribe((data: TeamMember[]) => {
      this.team = data;
    });
  }
}
