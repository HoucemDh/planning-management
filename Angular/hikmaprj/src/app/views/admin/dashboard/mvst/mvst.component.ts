// src/app/components/mvst/mvst.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MvstService } from '../../../../Services/Mvst/mvst.service';
import { Mvst, PageInfo } from '../../../../Types/mvst.types';

@Component({
    selector: 'app-mvst',
    templateUrl: './mvst.component.html',
    styleUrls: ['./mvst.component.css'],
    standalone: false
})
export class MvstComponent implements OnInit, OnDestroy {
  // State
  mvstData: Mvst[] = [];
  pageInfo: PageInfo | null = null;
  error: string | null = null;

  // Search
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Pagination
  currentPage = 0;
  readonly pageSize = 20;

  constructor(
    private mvstService: MvstService,
    private location: Location
  ) {
    this.setupSearchSubscription();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchSubject.next(this.searchQuery);
  }

  loadData(): void {
    this.error = null;

    this.mvstService.getMvstPages(
      this.currentPage,
      this.pageSize,
      this.searchQuery
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.mvstData = response.content;
        this.pageInfo = response.pageInfo;
      },
      error: (err) => {
        this.error = 'An error occurred while loading data. Please try again.';
        console.error('Error loading data:', err);
      }
    });
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
}
