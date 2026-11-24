import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminlayoutComponent } from './adminlayout/adminlayout.component';
import { FrontlayoutComponent } from './frontlayout/frontlayout.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    AdminlayoutComponent,
    FrontlayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }
