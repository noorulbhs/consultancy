import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-choose-us.component.html',
  styleUrls: ['./why-choose-us.component.scss']
})
export class WhyChooseUsComponent {
  features = [
    {
      icon: 'fas fa-medal',
      title: 'Expert Team',
      description: 'Our certified professionals bring years of experience and cutting-edge expertise to every project.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Timely Delivery',
      description: 'We understand the importance of deadlines and consistently deliver projects on time, every time.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control processes ensure that every solution meets the highest standards.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Client Partnership',
      description: 'We build long-term relationships with our clients, providing ongoing support and strategic guidance.'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Innovation Focus',
      description: 'Stay ahead of the curve with our innovative solutions leveraging the latest technologies and methodologies.'
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'Cost Effective',
      description: 'Maximize your ROI with our competitive pricing and efficient project management approaches.'
    }
  ];
}
