import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-powerbi-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './powerbi-view.component.html',
  styleUrls: ['./powerbi-view.component.css']
})
export class PowerbiViewComponent implements OnInit {
  @ViewChild('dashboardContainer') dashboardContainer!: ElementRef;

  iframeSrc: SafeResourceUrl;
  isLoading: boolean = true;
  powerBiUrl: string = 'https://app.powerbi.com/reportEmbed?reportId=b9683d52-7c60-4b87-882c-4a568f48a04e&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730';
  isFullscreen: boolean = false;

  constructor(private sanitizer: DomSanitizer) {
    // Sécuriser l'URL
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.powerBiUrl);
  }

  ngOnInit(): void {
    // Simuler un chargement initial
    setTimeout(() => {
      this.isLoading = false;
    }, 1200);
  }

  // Rafraîchir l'iframe avec animation
  refreshDashboard(): void {
    console.log('Refreshing PowerBI dashboard...');
    this.isLoading = true;

    // Vider temporairement l'iframe
    setTimeout(() => {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.powerBiUrl + '&refresh=' + new Date().getTime());

      // Simuler un temps de chargement réaliste
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    }, 300);
  }

  // Télécharger le rapport avec plus d'options
  downloadReport(): void {
    console.log('Downloading PowerBI report...');

    // Créer un menu contextuel pour choisir le format (simulation)
    const formats = ['PDF', 'Excel', 'PowerPoint'];
    const format = 'PDF'; // Par défaut

    // Ouvrir dans un nouvel onglet
    window.open(this.powerBiUrl + '&download=true&format=' + format, '_blank');
  }

  // Basculer en mode plein écran
  toggleFullscreen(): void {
    const element = this.dashboardContainer.nativeElement;

    if (!this.isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any)['mozCancelFullScreen']) {
        (document as any)['mozCancelFullScreen']();
      } else if ((document as any)['webkitExitFullscreen']) {
        (document as any)['webkitExitFullscreen']();
      } else if ((document as any)['msExitFullscreen']) {
        (document as any as any)['msExitFullscreen']();
      }
    }

    this.isFullscreen = !this.isFullscreen;
  }

  // Détecter quand l'utilisateur quitte le mode plein écran
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }
}
