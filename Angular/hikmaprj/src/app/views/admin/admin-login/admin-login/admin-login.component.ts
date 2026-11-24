import { Component } from '@angular/core';
import { AuthService } from '../../../../Services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthError } from '../../../../Types/auth.types';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminLoginComponent {
  showPassword: boolean = false;
  email: string = '';
  password: string = '';
  username: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  errorCode: string = '';
  formError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Reset error state
    this.errorMessage = '';
    this.errorCode = '';
    this.formError = false;
    
    // Form validation
    if (!this.email && !this.username) {
      this.errorMessage = 'Please enter your email or username';
      this.formError = true;
      return;
    }
    
    if (!this.password) {
      this.errorMessage = 'Please enter your password';
      this.formError = true;
      return;
    }
    
    this.isLoading = true;
    const username = this.username || this.email;

    this.authService.login({ username, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error: AuthError) => {
        this.isLoading = false;
        this.formError = true;
        
        // Set error message based on error code
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.errorCode = error.code || 'AUTH_ERROR';
        
        // Add animation class to the form
        this.addFormErrorAnimation();
        
        console.error('Login error:', error);
      }
    });
  }
  
  private addFormErrorAnimation(): void {
    const loginForm = document.querySelector('.login-box');
    if (loginForm) {
      loginForm.classList.add('error-shake');
      setTimeout(() => {
        loginForm.classList.remove('error-shake');
      }, 500);
    }
  }
}