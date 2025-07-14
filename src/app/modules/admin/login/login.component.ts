import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidePassword = true;
  loginFailed = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log('Login form submitted', this.loginForm.value);
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login API response:', response);
        if (response.success && response.data?.token) {
          // Store JWT token (localStorage or service)
          localStorage.setItem('admin_jwt', response.data.token);
          localStorage.setItem('admin_logged_in', 'true');
          this.notificationService.success('Login Successful', 'Welcome to the admin dashboard!');
          this.loginFailed = false;
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.loginFailed = true;
          this.notificationService.error('Login Failed', response.message || 'Invalid credentials');
        }
      },
      error: (err) => {
        this.loginFailed = true;
        console.error('Login API error:', err);
        this.notificationService.error('Login Failed', err?.error?.message || 'Invalid credentials');
      },
      complete: () => {
        console.log('Login API call completed');
      }
    });
  }
}
