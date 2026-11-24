import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../Services/User/user.service';
import { Location } from '@angular/common';
import { MenuStateService } from '../../../../Services/MenuState/menu-state.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserPayload } from '../../../../Types/user.types';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, ModalComponent]
})
export class UsersComponent implements OnInit {
  users: UserPayload[] = [];
  error: string = '';
  success: string = '';
  showModal: boolean = false;
  modalAction: 'deactivate' | 'reactivate' | null = null;
  selectedUserId: string | null = null;
  selectedUsername: string = '';
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private location: Location,
    private menuState: MenuStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading users: ' + error.message;
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  openModal(action: 'deactivate' | 'reactivate', userId: string, username: string): void {
    this.modalAction = action;
    this.selectedUserId = userId;
    this.selectedUsername = username;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalAction = null;
    this.selectedUserId = null;
    this.selectedUsername = '';
  }

  confirmAction(): void {
    if (!this.selectedUserId || !this.modalAction) return;
    
    this.loading = true;
    if (this.modalAction === 'deactivate') {
      this.deactivateUser(this.selectedUserId);
    } else {
      this.reactivateUser(this.selectedUserId);
    }
    this.closeModal();
  }

  deactivateUser(userId: string): void {
    this.userService.deactivateUser(userId).subscribe({
      next: (response) => {
        this.success = `User ${response.username} has been deactivated successfully`;
        this.loadUsers();
        setTimeout(() => this.success = '', 5000); // Clear success message after 5 seconds
      },
      error: (error) => {
        this.error = `Error deactivating user: ${error.message}`;
        console.error('Error deactivating user:', error);
        this.loading = false;
        setTimeout(() => this.error = '', 5000); // Clear error message after 5 seconds
      }
    });
  }

  editUser(userId: string): void {
    this.router.navigate(['/admin/dashboard/userform', userId]);
  }

  reactivateUser(userId: string): void {
    this.userService.reactivateUser(userId).subscribe({
      next: (response) => {
        this.success = `User ${response.username} has been reactivated successfully`;
        this.loadUsers();
        setTimeout(() => this.success = '', 5000); // Clear success message after 5 seconds
      },
      error: (error) => {
        this.error = `Error reactivating user: ${error.message}`;
        console.error('Error reactivating user:', error);
        this.loading = false;
        setTimeout(() => this.error = '', 5000); // Clear error message after 5 seconds
      }
    });
  }
}