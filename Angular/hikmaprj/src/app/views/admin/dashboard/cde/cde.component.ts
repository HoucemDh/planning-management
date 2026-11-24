import { PageInfo } from './../../../../Types/mvst.types';
import { debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { CdeService } from '../../../../Services/Cde/cde.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { response } from 'express';

@Component({
    selector: 'app-cde',
    templateUrl: './cde.component.html',
    styleUrl: './cde.component.css',
    standalone: false
})
export class CdeComponent implements OnInit, OnDestroy {

  error: String | null=null;
  Cde: any[] = [];
  pageInfo : PageInfo| null = null;

  // Search
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Pagination
  currentPage = 0;
  readonly pageSize = 20;

  constructor(private CdeService: CdeService, private location: Location) {
    this.setupSearchSubscription()
  }

  ngOnInit() {
    this.loadData();
  }

 private setupSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadData();
    });
  }

  loadData(){
    this.error = null;
    this.CdeService.getAllCde(
      this.currentPage,
      this.pageSize,
      this.searchQuery
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next : (response) => {
        this.Cde = response.content;
        this.pageInfo = response.pageInfo;
      },
      error: (err)=>{
        this.error = 'An error occurred while loading data. Please try again.';
        console.error('Error loading data:', err);
      }
    });
}

    onSearchInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.searchQuery = input.value;
      this.searchSubject.next(this.searchQuery);
    }

    onPageChange(page: number): void {
      if (page !== this.currentPage && page >= 0 && (!this.pageInfo || page < this.pageInfo.totalPages)) {
        this.currentPage = page;
        this.loadData();
      }
    }

    getVisiblePages(): (number | string)[] {
      if (!this.pageInfo) return [];

      const totalPages = this.pageInfo.totalPages;
      const current = this.pageInfo.pageNumber;
      const pages: (number | string)[] = [];

      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i);
      }

      pages.push(0);
      if (current > 3) pages.push('...');

      for (let i = Math.max(1, current - 1); i <= Math.min(current + 1, totalPages - 2); i++) {
        pages.push(i);
      }

      if (current < totalPages - 4) pages.push('...');
      if (totalPages > 1) pages.push(totalPages - 1);

      return pages;
    }

    isEllipsis = (page: number | string): boolean => page === '...';
    getPageNumber = (page: number | string): number => typeof page === 'number' ? page : 0;
    goBack = (): void => this.location.back();

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
  