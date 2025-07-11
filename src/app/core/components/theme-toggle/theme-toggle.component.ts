import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle-btn"
      (click)="toggleTheme()"
      [attr.aria-label]="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      title="{{ isDark ? 'Switch to light theme' : 'Switch to dark theme' }}"
    >
      <i class="fas" [ngClass]="isDark ? 'fa-sun' : 'fa-moon'"></i>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      background: none;
      border: 2px solid;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 18px;
      position: relative;
      overflow: hidden;
    }

    .light-theme .theme-toggle-btn {
      border-color: #6c757d;
      color: #6c757d;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    .light-theme .theme-toggle-btn:hover {
      border-color: #495057;
      color: #495057;
      background: rgba(255, 255, 255, 1);
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .dark-theme .theme-toggle-btn {
      border-color: #ffc107;
      color: #ffc107;
      background: rgba(33, 37, 41, 0.9);
      backdrop-filter: blur(10px);
    }

    .dark-theme .theme-toggle-btn:hover {
      border-color: #ffcd39;
      color: #ffcd39;
      background: rgba(33, 37, 41, 1);
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
    }

    .theme-toggle-btn i {
      transition: all 0.3s ease;
    }

    .theme-toggle-btn:hover i {
      transform: rotate(15deg);
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDark = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
