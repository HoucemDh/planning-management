import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  cameFromConsultation: boolean = false;
  previousUrl: string | null = null;

  constructor() {}

  setNavigationSource(source: boolean, prevUrl: string) {
    this.cameFromConsultation = source;
    this.previousUrl = prevUrl;  // Store the previous URL
  }

  getNavigationSource(): { fromConsultation: boolean; previousUrl: string | null } {
    return {
      fromConsultation: this.cameFromConsultation,
      previousUrl: this.previousUrl,
    };
  }
}
