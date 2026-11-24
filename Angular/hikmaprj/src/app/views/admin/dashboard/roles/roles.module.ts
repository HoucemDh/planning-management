import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { RoleFormComponent } from '../role-form/role-form.component';

const routes: Routes = [
  { path: '', component: RolesComponent },
  { path: 'roleform', component: RoleFormComponent }
];

@NgModule({
  imports: [
    RolesComponent,
    RoleFormComponent,
    RouterModule.forChild(routes)
  ]
})
export class RolesModule {}
