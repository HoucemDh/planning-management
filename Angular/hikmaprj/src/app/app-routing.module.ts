import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontlayoutComponent } from './layout/frontlayout/frontlayout.component';
import { AdminlayoutComponent } from './layout/adminlayout/adminlayout.component';
import { AuthGuard } from './Guards/gard/auth.guard';
import { AdminGuard } from './Guards/gard/admin.guard';
import { TeamhistoryComponent } from './views/admin/dashboard/dashboard/componments/teamhistory/teamhistory.component';

const routes: Routes = [
  {
    path: '',
    component: FrontlayoutComponent,
    children: [
      {path: 'userlogin', loadChildren: () => import('./views/front/userlogin/userlogin.module').then(m => m.UserloginModule)},
      {path: 'home', loadChildren: () => import('./views/front/home/home.module').then(m => m.HomeModule)}
    ]
  },
  { path: 'teamhistory',
    component: TeamhistoryComponent },

  {
    path: 'admin',
    component: AdminlayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/admin/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard/users',
        loadChildren: () => import('./views/admin/dashboard/users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'dashboard/userform',
        loadChildren: () => import('./views/admin/dashboard/user-form/user.module').then(m => m.UsersModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'dashboard/roles',
        loadChildren: () => import('./views/admin/dashboard/roles/roles.module').then(m => m.RolesModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'adminlogin',
        loadChildren: () => import('./views/admin/admin-login/admin-login.module').then(m => m.AdminLoginModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export { routes };
