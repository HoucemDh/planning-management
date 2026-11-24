import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../../Services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() activeMenu: string = 'dashboard';
  @Input() menuCollapsed: boolean = false;

  @Output() menuChange = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  constructor(public authService : AuthService) {}
  // Navigate to menu item
  navigateTo(menu: string): void {
    this.menuChange.emit(menu);
  }

  // Logout function
  logoutUser(): void {
    this.logout.emit();
  }
}
