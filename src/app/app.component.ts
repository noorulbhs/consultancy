import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationToastComponent } from './core/components/notification-toast/notification-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'altrevo';
}
