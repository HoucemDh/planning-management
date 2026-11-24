import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './../users/users.component';
import { RoleFormComponent } from '../role-form/role-form.component';
import { UserFormComponent } from './user-form.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'userform', component: UserFormComponent }
];

@NgModule({
  imports: [
    UsersComponent,
    UserFormComponent,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule {}
