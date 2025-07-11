import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss']
})
export class CtaComponent {
  ctaData = {
    title: 'Ready to Transform Your Business?',
    subtitle: 'Let\'s discuss how our expert technology consultancy services can help you achieve your goals and drive digital transformation with cutting-edge solutions.',
    primaryAction: {
      text: 'Get Consultation',
      link: '/contact'
    },
    secondaryAction: {
      text: 'View Our Services',
      link: '/services'
    }
  };
}
