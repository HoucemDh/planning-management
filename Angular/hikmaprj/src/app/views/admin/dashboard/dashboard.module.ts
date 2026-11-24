import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GloablStockComponent } from './gloabl-stock/gloabl-stock.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { StockComponent } from './stock/stock.component';
import { CdeComponent } from './cde/cde.component';
import { MvstComponent } from './mvst/mvst.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RotationMpComponent } from './rotation-mp/rotation-mp.component';
import { OfencComponent } from './ofenc/ofenc.component';
import { CrltofComponent } from './crltof/crltof.component';
import { CdeachatComponent } from './cdeachat/cdeachat.component';
import { BomComponent } from './bom/bom.component';
import { PlanComponent } from './plan/plan.component';
import { BomNComponent } from './bomn/bomn.component';
import { UserManagementComponent } from './dashboard/componments/user-management/user-management.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    GloablStockComponent,
    NavbarComponent,
    StockComponent,
    CdeComponent,
    MvstComponent,
    RotationMpComponent,
    OfencComponent,
    CrltofComponent,
    CdeachatComponent,
    BomComponent,
    BomNComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgxPaginationModule,
    PlanComponent,
    UserManagementComponent,

  ]
})
export class DashboardModule { }
