import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../Services/User/user.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RoleFormComponent implements OnInit {
  roleForm: FormGroup;
  error: string = '';
  success: string = '';
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  roleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.roleId = params['id'];
        this.userService.roles$.subscribe(roles => {
          const role = roles.find(r => r.id === this.roleId);
          if (role) {
            this.roleForm.patchValue({
              name: role.name
            });
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.isSubmitting = true;
      const roleData = { name: this.roleForm.value.name };

      const operation = this.isEditMode && this.roleId
        ? this.userService.updateRole(this.roleId, roleData)
        : this.userService.createRole(roleData);

      operation.subscribe({
        next: (response) => {
          this.success = `Role ${this.isEditMode ? 'updated' : 'created'} successfully`;
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard/roles']);
          }, 1500);
        },
        error: (error) => {
          this.error = error.message;
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}