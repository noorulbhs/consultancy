import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService, TeamMember } from '../../admin/team-manager/services/team.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  team: TeamMember[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.getAll().subscribe((data: TeamMember[]) => this.team = data);
  }
}
