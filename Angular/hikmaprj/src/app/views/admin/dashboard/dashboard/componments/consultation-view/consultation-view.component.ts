import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ModuleInfo {
  name: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-consultation-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultation-view.component.html',
  styleUrls: ['./consultation-view.component.css']
})
export class ConsultationViewComponent implements OnInit {
  @Output() navigateToModule = new EventEmitter<string>();

  modules: ModuleInfo[] = [];

  ngOnInit(): void {
    // Initialize modules with their information including last updated timestamps
    this.modules = [
      {
        name: 'plan',
        title: 'production  planning',
        description: 'Manage production schedules and timelines',
        icon: 'bx-calendar-check'
      },
      {
        name: 'bomn',
        title: 'Bill Of Materials',
        description: 'Basic bill of materials',
        icon: 'bx-spreadsheet'
            },
      {
        name: 'bom',
        title: 'Requirement BOM',
        description: 'View and manage component requirements',
        icon: 'bx-list-check'
      },
      {
        name: 'stock',
        title: 'Rotation Row',
        description: 'Track and manage raw material inventory',
        icon: 'bx-package'
      },
      {
        name: 'globalstock',
        title: 'Global Inventory',
        description: 'Complete inventory overview across locations',
        icon: 'bx-box'
      },
      {
        name: 'cdeachat',
        title: 'cmdachat',
        description: 'Manage procurement process and orders',
        icon: 'bx-purchase-tag'
      },
      {
        name: 'Cde',
        title: 'Order Management',
        description: 'Manage and track customer orders',
        icon: 'bx-cart-alt'
      },
      {
        name: 'Mvst',
        title: 'Movement Tracking',
        description: 'Monitor inventory movements and transfers',
        icon: 'bx-transfer'
      },
      {
        name: 'ofenc',
        title: 'OFENC',
        description: 'OFENC management system',
        icon: 'bx-file'
      },
      {
        name: 'crltof',
        title: 'Control OF',
        description: 'Production order verification',
        icon: 'bx-check-shield'
      }
    ];
  }

  moduleNavigate(module: string): void {
    this.navigateToModule.emit(module);
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Updated ${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `Updated ${diffHours}h ago`;
    } else {
      return `Updated ${diffDays}d ago`;
    }
  }
}
