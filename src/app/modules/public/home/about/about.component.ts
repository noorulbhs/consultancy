import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService, TeamMember } from '../../../admin/team-manager/services/team.service';
import { StaticPageService } from '../../../admin/static-page-manager/services/static-page.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  team: TeamMember[] = [];
  featuredTeam: TeamMember[] = [];
  
  // Static content
  storyContent = '';
  missionContent = '';
  visionContent = '';

  constructor(
    private teamService: TeamService,
    private staticPageService: StaticPageService
  ) {}

  ngOnInit(): void {
    this.loadTeamData();
    this.loadStaticContent();
  }

  loadTeamData(): void {
    this.teamService.getALLPublic().subscribe((data: TeamMember[]) => {
      this.team = data.filter(member => member.isPublic);
      this.featuredTeam = this.team.filter(member => member.featured);
    });
  }

  loadStaticContent(): void {
    // Load Our Story content
    this.staticPageService.getContent('about-story').subscribe(content => {
      this.storyContent = content || this.getDefaultStoryContent();
    });

    // Load Our Mission content
    this.staticPageService.getContent('about-mission').subscribe(content => {
      this.missionContent = content || this.getDefaultMissionContent();
    });

    // Load Our Vision content
    this.staticPageService.getContent('about-vision').subscribe(content => {
      this.visionContent = content || this.getDefaultVisionContent();
    });
  }

  // Fallback content if static pages are not available
  getDefaultStoryContent(): string {
    return `<p>At Altrevo, we empower businesses with cutting-edge technology solutions. Our journey began with a vision to solve complex technical challenges for startups and enterprises alike.</p>
    <p>With a dedicated team of developers, architects, and designers, we provide scalable, secure, and modern tech solutions.</p>`;
  }

  getDefaultMissionContent(): string {
    return `<p>To deliver reliable and scalable digital solutions tailored to every business need.</p>`;
  }

  getDefaultVisionContent(): string {
    return `<p>To become a global leader in technology consultancy by continuously innovating and delivering value.</p>`;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  getExperienceYears(experience: string): number {
    const match = experience?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  getAverageExperience(): number {
    if (this.team.length === 0) return 0;
    const totalExperience = this.team.reduce((sum, member) => 
      sum + this.getExperienceYears(member.experience || '0'), 0);
    return Math.round(totalExperience / this.team.length);
  }

  getTotalSkills(): number {
    return this.team.reduce((sum, member) => 
      sum + (member.skills?.length || 0), 0);
  }

  getDepartmentCount(): number {
    const departments = new Set(this.team.map(member => member.department));
    return departments.size;
  }

  // Helper method to strip HTML for display in text-only contexts
  stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
