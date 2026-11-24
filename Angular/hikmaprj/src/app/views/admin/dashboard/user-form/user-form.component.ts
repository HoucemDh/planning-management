import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../Services/User/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RolePayload, UserPayload } from '../../../../Types/user.types';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  roles: RolePayload[] = [];
  error: string = '';
  success: string = '';
  isEditMode: boolean = false;
  userId: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      roleIds: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.loading = true;
    
    // Load roles
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading roles: ' + error.message;
        this.loading = false;
      }
    });

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = params['id'];
        // Fix: Use params['id'] directly since we've already checked it's not null
        this.loadUserData(params['id']);
      }
    });
  }

  loadUserData(userId: string) {
    this.loading = true;
    this.userService.users$.subscribe(users => {
      const user = users.find(u => u.id === userId);
      if (user) {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          roleIds: user.roles.map(role => role.id)
        });
      } else {
        this.error = 'User not found';
      }
      this.loading = false;
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      
      // Fix: Check userId exists before using it
      if (this.isEditMode && this.userId) {
        this.updateExistingUser();
      } else {
        this.createNewUser();
      }
    }
  }
  
  private updateExistingUser() {
    // We can safely assert userId is not null here
    this.userService.updateUser(this.userId!, this.userForm.value).subscribe({
      next: (response) => {
        this.handleSuccess('updated');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
  
  private createNewUser() {
    this.userService.createUser(this.userForm.value).subscribe({
      next: (response) => {
        this.handleSuccess('created');
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
  
  private handleSuccess(action: string) {
    this.success = `User ${action} successfully`;
    setTimeout(() => {
      this.router.navigate(['/admin/dashboard/users']);
    }, 1500);
  }
  
  private handleError(error: any) {
    this.error = error.message;
    this.loading = false;
  }

  onRoleChange(event: any, roleId: string) {
    const roleIds = this.userForm.get('roleIds')?.value || [];
    if (event.target.checked) {
      roleIds.push(roleId);
    } else {
      const index = roleIds.indexOf(roleId);
      if (index > -1) {
        roleIds.splice(index, 1);
      }
    }
    this.userForm.patchValue({ roleIds });
  }

  isRoleSelected(roleId: string): boolean {
    const roleIds = this.userForm.get('roleIds')?.value || [];
    return roleIds.includes(roleId);
  }

  goBack() {
    this.router.navigate(['/admin/dashboard/users']);
  }
}