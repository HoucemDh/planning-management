// teamhistory.component.ts
import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../../../../../Services/audit-logs/audit-logs.service';
import { AuditLogs } from '../../../../../../Types/audit-log.types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-teamhistory',
  templateUrl: './teamhistory.component.html',
  imports: [CommonModule],
  styleUrls: ['./teamhistory.component.css']
})
export class TeamhistoryComponent implements OnInit {
  auditLogs: AuditLogs[] = [];
  loading = true;
currentPage = 1;
itemsPerPage = 5;
  constructor(
    private auditLogService: AuditLogService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.auditLogService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading audit logs', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  get paginatedLogs(): AuditLogs[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.auditLogs.slice(startIndex, startIndex + this.itemsPerPage);
}

get totalPages(): number {
  return Math.ceil(this.auditLogs.length / this.itemsPerPage);
}
}
