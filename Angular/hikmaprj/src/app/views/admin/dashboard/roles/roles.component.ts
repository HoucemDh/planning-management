import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../../Services/User/user.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RolePayload } from '../../../../Types/user.types';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RolesComponent implements OnInit, OnDestroy {
  roles: RolePayload[] = [];
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  private subscription = new Subscription();

  constructor(
    private roleService: UserService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.subscription.add(
      this.roleService.roles$.subscribe({
        next: (roles) => {
          this.roles = roles;
        },
        error: (error) => {
          this.showMessage('Error loading roles: ' + error.message, 'error');
        }
      })
    );
  }

  loadRoles(): void {
    this.subscription.add(
      this.roleService.getRoles().subscribe({
        next: (roles) => {
          this.roles = roles;
        },
        error: (error) => {
          this.showMessage('Error loading roles: ' + error.message, 'error');
          console.error('Error loading roles:', error);
        }
      })
    );
  }

  editRole(roleId: string): void {
    this.router.navigate(['/admin/dashboard/roleform', roleId]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }

  goBack(): void {
    this.location.back();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}