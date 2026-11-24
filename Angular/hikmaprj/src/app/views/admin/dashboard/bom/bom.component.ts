import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BomService } from '../../../../Services/Bom/bom.service';
import { Bom, PageInfo } from '../../../../Types/bom.types';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.css'],
  standalone: false
})
export class BomComponent implements OnInit, OnDestroy {
  // State
  bomData: Bom[] = [];
  filteredBomData: Bom[] = [];
  pageInfo: PageInfo | null = null;
  error: string | null = null;

  // Search
  searchQuery = '';
  filters: { [key: string]: string } = {};
  showFilter: { [key: string]: boolean } = {};
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Pagination
  currentPage = 0;
  readonly pageSize = 20;

  // Columns for filtering
  columns: string[] = [
    'codeproduit', 'BOM_Alternative', 'Categorie_Produit', 'libellesPF',
    'taillelot', 'article', 'libellesMP', 'Qte_besoin', 'unite'
  ];

  constructor(
    private bomService: BomService,
    private location: Location,
    private router: Router
  ) {
    this.setupSearchSubscription();
    this.initializeFilters();
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

    this.bomService.getBomPages(
      this.currentPage,
      this.pageSize,
      this.searchQuery
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.bomData = response.content;
        this.applyFilters();
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

  goBack(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Navigate back to the consultation view in the dashboard
    this.router.navigate(['/admin/dashboard'], {
      queryParams: {
        view: 'consultation'
      }
    });
  }

  applyFilters(): void {
    this.filteredBomData = this.bomData.filter(item => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key].toLowerCase().trim();
        if (!filterValue) return true;
        const itemValue = String(item[key as keyof Bom] || '').toLowerCase();
        return itemValue.includes(filterValue);
      });
    });
  }

  private initializeFilters(): void {
    this.columns.forEach(column => {
      this.filters[column] = '';
      this.showFilter[column] = false;
    });
  }

  toggleFilter(column: string, event: Event): void {
    event.stopPropagation();
    this.showFilter[column] = !this.showFilter[column];
  }

  onFilterChange(column: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters[column] = input.value;
    this.applyFilters();
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    if (!this.isClickInsideFilter(event)) {
      this.closeAllFilters();
    }
  }

  isClickInsideFilter(event: MouseEvent): boolean {
    return Array.from(document.querySelectorAll('.filter-container')).some(container =>
      container.contains(event.target as Node)
    );
  }

  closeAllFilters(): void {
    Object.keys(this.showFilter).forEach(key => {
      this.showFilter[key] = false;
    });
  }
}
