import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FooterService } from '../../services/footer.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerData: any;

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.getFooterData().subscribe((data) => {
      this.footerData = data;
    });
  }
}
