import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserloginRoutingModule } from './userlogin-routing.module';
import { UserloginComponent } from './userlogin/userlogin.component';


@NgModule({
  declarations: [
    UserloginComponent
  ],
  imports: [
    CommonModule,
    UserloginRoutingModule
  ]
})
export class UserloginModule { }
