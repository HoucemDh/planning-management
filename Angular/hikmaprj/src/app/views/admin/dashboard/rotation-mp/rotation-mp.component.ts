import { Location } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { RotationMpService } from './../../../../Services/RotationMp/rotation-mp.service';
import { PageInfo, rotationMp } from './../../../../Types/rotation.types';
import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-rotation-mp',
    templateUrl: './rotation-mp.component.html',
    styleUrl: './rotation-mp.component.css',
    standalone: false
})
export class RotationMpComponent implements OnInit, OnDestroy {
  pageInfo: PageInfo | null = null;
  error: String | null = null;
  rotatioMp: rotationMp[] = [];
  isGenerating = false;
  lastUpdateTime: Date = new Date();
  filterNegative = false;

  searchQuery = "";
  currentPage = 0;
  readonly pageSize = 20;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private location: Location, 
    private rotationMpService: RotationMpService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.setupSearchSubscription();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTime = localStorage.getItem('lastUpdateTime');
      if (savedTime) {
        this.lastUpdateTime = new Date(savedTime);
      }
    }
    this.LoadData();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchSubject.next(this.searchQuery);
  }

  generateRotation(): void {
    if (this.isGenerating) return;
    
    this.isGenerating = true;
    this.error = null;
    
    this.rotationMpService.generateRotation()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentPage = 0;
          this.lastUpdateTime = new Date();
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('lastUpdateTime', this.lastUpdateTime.toISOString());
          }
          this.LoadData();
          this.isGenerating = false;
        },
        error: (err) => {
          this.error = 'Failed to generate rotation. Please try again.';
          console.error('Error generating rotation:', err);
          this.isGenerating = false;
        }
      });
  }

  toggleFilter(): void {
    this.filterNegative = !this.filterNegative;
    this.currentPage = 0;
    this.LoadData(); // This will now use both current filter and search state
  }

  LoadData(): void {
    this.error = null;
    
    this.rotationMpService.getRotationPages(
      this.currentPage,
      this.pageSize,
      this.filterNegative,
      this.searchQuery
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.rotatioMp = response.content;
        this.pageInfo = response.pageInfo;
      },
      error: (err) => {
        this.error = 'An error occurred while loading data. Please try again';
        console.error("Error loading data: ", err);
      }
    });
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
      this.LoadData();
    });
  }

  goBack(): void {
    this.location.back();
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage && page >= 0 && (!this.pageInfo || page < this.pageInfo.totalPages)) {
      this.currentPage = page;
      this.LoadData();
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

  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}