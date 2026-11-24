import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../../Services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  @Input() menuCollapsed: boolean = false;
  @Output() toggleMenuEvent = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  // UI state variables
  showNotifications: boolean = false;
  showUserMenu: boolean = false;

  constructor(public authService : AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check authentication status
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!isAuth) {
        this.showUserMenu = false;
        this.showNotifications = false;
      }
    });
  }

  // Get user initials for avatar fallback
  get userInitials(): string {
    const username = this.authService.getUsername();
    if (!username) return 'U';

    const names = username.split(' ');
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names.length > 1
      ? names[names.length - 1].charAt(0).toUpperCase()
      : '';

    return `${firstInitial}${lastInitial}`;
  }

  // Get username for display
  get username(): string {
    return this.authService.getUsername() || 'ReadOnlyUser';
  }

  // Get primary role for display
  get primaryRole(): string {
    if (this.authService.isAdmin()) {
      return 'Administrator';
    } else if (this.authService.isPlanner()) {
      return 'Planner';
    }
    return 'Read-Only-User';
  }

  toggleMenu(): void {
    this.toggleMenuEvent.emit();
  }



  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false;
    }
  }

navigateTo(destination: string): void {
  console.log('Navigating to:', destination);
  this.router.navigate([`/${destination}`]);
  this.showUserMenu = false;
}


  closeDropdowns(): void {
    this.showNotifications = false;
    this.showUserMenu = false;
  }
}
