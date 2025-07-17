import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SettingsService } from '../../../../admin/site-settings/services/settings.service';
import { SiteSettings } from '../../../../admin/site-settings/mock/settings-data';

interface Stat {
  number: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  stats: Stat[] = [
    {
      number: '150+',
      label: 'Projects Completed',
      icon: 'fas fa-project-diagram'
    },
    {
      number: '50+',
      label: 'Happy Clients',
      icon: 'fas fa-users'
    },
    {
      number: '10+',
      label: 'Years Experience',
      icon: 'fas fa-calendar-alt'
    },
    {
      number: '25+',
      label: 'Expert Team Members',
      icon: 'fas fa-user-tie'
    }
  ];

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.loadStatsFromSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private iconMap: { [key: string]: string } = {
    project: 'fas fa-clipboard-check',
    client: 'fas fa-users',
    experience: 'fas fa-hourglass-half',
    support: 'fas fa-headset',
    satisfaction: 'fas fa-smile-beam',
    rating: 'fas fa-star',
    team: 'fas fa-user-tie',
    success: 'fas fa-trophy'
  };

  private loadStatsFromSettings(): void {
    this.settingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings: SiteSettings | null) => {
        if (settings && settings.statistics) {
          const allStats = [
            {
              number: settings.statistics.projectsCompleted.number,
              label: settings.statistics.projectsCompleted.label,
              icon: this.iconMap[settings.statistics.projectsCompleted.icon] || 'fas fa-clipboard-check',
              enabled: settings.statistics.projectsCompleted.enabled
            },
            {
              number: settings.statistics.happyClients.number,
              label: settings.statistics.happyClients.label,
              icon: this.iconMap[settings.statistics.happyClients.icon] || 'fas fa-users',
              enabled: settings.statistics.happyClients.enabled
            },
            {
              number: settings.statistics.yearsExperience.number,
              label: settings.statistics.yearsExperience.label,
              icon: this.iconMap[settings.statistics.yearsExperience.icon] || 'fas fa-hourglass-half',
              enabled: settings.statistics.yearsExperience.enabled
            },
            {
              number: settings.statistics.support.number,
              label: settings.statistics.support.label,
              icon: this.iconMap[settings.statistics.support.icon] || 'fas fa-headset',
              enabled: settings.statistics.support.enabled
            },
            {
              number: settings.statistics.clientSatisfaction.number,
              label: settings.statistics.clientSatisfaction.label,
              icon: this.iconMap[settings.statistics.clientSatisfaction.icon] || 'fas fa-smile-beam',
              enabled: settings.statistics.clientSatisfaction.enabled
            },
            {
              number: settings.statistics.averageRating.number,
              label: settings.statistics.averageRating.label,
              icon: this.iconMap[settings.statistics.averageRating.icon] || 'fas fa-star',
              enabled: settings.statistics.averageRating.enabled
            },
            {
              number: settings.statistics.teamMembers.number,
              label: settings.statistics.teamMembers.label,
              icon: this.iconMap[settings.statistics.teamMembers.icon] || 'fas fa-user-tie',
              enabled: settings.statistics.teamMembers.enabled
            },
            {
              number: settings.statistics.successRate.number,
              label: settings.statistics.successRate.label,
              icon: this.iconMap[settings.statistics.successRate.icon] || 'fas fa-trophy',
              enabled: settings.statistics.successRate.enabled
            }
          ];
          // Filter to only show enabled stats
          this.stats = allStats
            .filter(stat => stat.enabled)
            .map(stat => ({
              number: stat.number,
              label: stat.label,
              icon: stat.icon
            }));
        }
      });
  }
}
