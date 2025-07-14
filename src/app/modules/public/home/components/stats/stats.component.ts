import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { SiteSettings, StatisticItem } from '../../../../../core/interfaces/site-settings.interface';

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

  constructor(private settingsService: SiteSettingsService) {}

  ngOnInit(): void {
    this.loadStatsFromSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStatsFromSettings(): void {
    this.settingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings: SiteSettings | null) => {
        if (settings?.statistics) {
          // Create array of all possible stats
          const statsArr = [
            settings.statistics.projectsCompleted,
            settings.statistics.clientsSatisfied,
            settings.statistics.yearsExperience,
            settings.statistics.teamMembers
          ].filter((stat): stat is StatisticItem => !!stat && stat.enabled);
          this.stats = statsArr.map(stat => ({
            number: stat.number,
            label: stat.label,
            icon: stat.icon
          }));
        }
      });
  }
}
