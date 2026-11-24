import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GloablStockComponent } from './gloabl-stock/gloabl-stock.component';
import { StockComponent } from './stock/stock.component';
import { CdeComponent } from './cde/cde.component';
import { MvstComponent } from './mvst/mvst.component';
import { RotationMpComponent } from './rotation-mp/rotation-mp.component';
import { OfencComponent } from './ofenc/ofenc.component';
import { CrltofComponent } from './crltof/crltof.component';
import { CdeachatComponent } from './cdeachat/cdeachat.component';
import { BomComponent } from './bom/bom.component';
import { PlanComponent } from './plan/plan.component';
import { BomNComponent } from './bomn/bomn.component';
import { UsersComponent } from './users/users.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { RolesComponent } from './roles/roles.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ConsultationViewComponent } from './dashboard/componments/consultation-view/consultation-view.component';


const routes: Routes = [
  {path:'',component:DashboardComponent},
  {path:'globalstock',component:GloablStockComponent},
  {path:'stock', component:StockComponent},
  {path:'Cde',component:CdeComponent},
  {path:'Mvst', component:MvstComponent},
  {path:'rotationMp', component : RotationMpComponent},
  {path:'ofenc', component : OfencComponent},
  {path:'crltof', component : CrltofComponent},
  {path:'cdeachat', component : CdeachatComponent},
  {path:'bom', component : BomComponent},
  {path:'plan', component : PlanComponent},
  {path:'bomn', component : BomNComponent},
  {path:'users', component : UsersComponent},
  {path:'roles', component : RolesComponent},
  {path:'roleform', component : RoleFormComponent},
  {path:'userform', component : UserFormComponent},
  {path:'userform/:id', component : UserFormComponent},
  { path:'roleform/:id', component: RoleFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
