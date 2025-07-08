import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  stats = [
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
      number: '24/7',
      label: 'Support Available',
      icon: 'fas fa-headset'
    }
  ];
}
