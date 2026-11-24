import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {

  ConsultationMenu:boolean=true;
  UsersMenu : boolean=false;
  constructor() { }

  ShowConsultation() {
    this.ConsultationMenu = true;
    this.UsersMenu = false;
  }

  ShowUsersMenu() {
    this.UsersMenu = true;
    this.ConsultationMenu = false;
  }

}
