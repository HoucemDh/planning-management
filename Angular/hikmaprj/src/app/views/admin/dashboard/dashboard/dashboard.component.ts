import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './componments/sidebar/sidebar.component';
import { TopbarComponent } from './componments/topbar/topbar.component';
import { DashboardViewComponent } from './componments/dashboard-view/dashboard-view.component';
import { ConsultationViewComponent } from './componments/consultation-view/consultation-view.component';
import { PowerbiViewComponent } from './componments/powerbi-view/powerbi-view.component';
import { AiAnalysisComponent } from './componments/ai-analysis/ai-analysis.component';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserManagementComponent } from './componments/user-management/user-management.component';
import { AuthService } from '../../../../Services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    DashboardViewComponent,
    ConsultationViewComponent,
    PowerbiViewComponent,
    AiAnalysisComponent,
    UserManagementComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  // Menu state
  activeMenu: string = 'dashboard';
  menuCollapsed: boolean = false;
 currentDate: string = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize.bind(this));
    }

    // Handle query params for active view
    this.route.queryParams.subscribe(params => {
      if (params['view']) {
        this.activeMenu = params['view'];
      }
    });
  }

  // Check screen size and adjust menu accordingly
  checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.menuCollapsed = window.innerWidth < 768;
    }
  }

  // Toggle menu collapse state
  toggleMenu(): void {
    this.menuCollapsed = !this.menuCollapsed;
  }

  // Handle menu navigation from child components
  onMenuChange(menu: string): void {
    this.activeMenu = menu;
  }

  // Handle logout from child components
  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/adminlogin']);
        } else {
          console.error('Logout failed:', response.message);
        }
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if the server-side logout fails, clear the local session
        this.router.navigate(['/admin/adminlogin']);
      }
    });
  }

  // Handle module navigation from child components
  onNavigateToModule(module: string): void {
    this.router.navigate([`/admin/dashboard/${module}`]);
  }
}
