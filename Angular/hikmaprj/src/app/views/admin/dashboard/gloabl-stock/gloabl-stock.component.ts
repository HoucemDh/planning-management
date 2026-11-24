import { Globalstock, PageInfo } from './../../../../Types/globalStock.types';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ArticleService } from '../../../../Services/Global stock/operations.service';
import { Location } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-gloabl-stock',
  templateUrl: './gloabl-stock.component.html',
  styleUrls: ['./gloabl-stock.component.css'],
  standalone: false
})
export class GloablStockComponent implements OnInit, OnDestroy {
  pageInfo: PageInfo | null = null;
  globalStock: Globalstock[] = [];
  filteredGlobalStock: Globalstock[] = [];
  error: string | null = null;

  searchQuery: string = "";
  filters: { [key: string]: string } = {};
  showFilter: { [key: string]: boolean } = {};
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Pagination
  currentPage = 0;
  readonly pageSize = 20;

  // Columns for filtering
  columns: string[] = [
    'article', 'designation', 'categorie', 'quantiteUS', 'uniteStock',
    'quantiteActiveUS', 'quantiteAllouee', 'dateMVT', 'lot', 'sLot',
    'identifiant', 'identifiant2', 'emplacement', 'statut', 'lotFournisseur',
    'datePeremption', 'dateRecontrole', 'demandeAnalyse', 'quantiteUC', 'coefUCUS'
  ];

  constructor(
    private articleService: ArticleService,
    private Location: Location
  ) {
    this.setupSearchSubscription();
    this.initializeFilters();
  }

  ngOnInit(): void {
    this.loadGlobalStock();
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
      this.loadGlobalStock();
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchSubject.next(this.searchQuery);
  }

  loadGlobalStock(): void {
    this.error = null;

    this.articleService.getArticlesPages(
      this.currentPage,
      this.pageSize,
      this.searchQuery
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.globalStock = response.content;
        this.applyFilters();
        this.pageInfo = response.pageInfo;
      },
      error: (err) => {
        this.error = "An error occurred while loading data. Please try again.";
        console.error("Error loading data:", err);
      }
    });
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage && page >= 0 && (!this.pageInfo || page < this.pageInfo.totalPages)) {
      this.currentPage = page;
      this.loadGlobalStock();
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

  goBack = (): void => this.Location.back();

  applyFilters(): void {
    this.filteredGlobalStock = this.globalStock.filter(item => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key].toLowerCase().trim();
        if (!filterValue) return true;
        const itemValue = String(item[key as keyof Globalstock] || '').toLowerCase();
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
