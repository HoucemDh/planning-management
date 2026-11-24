import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleFormComponent } from './role-form.component';

const routes: Routes = [
  {
    path: '',
    component: RoleFormComponent
  }
];

@NgModule({
  imports: [
    RoleFormComponent,
    RouterModule.forChild(routes)
  ]
})
export class RoleFormModule { }
