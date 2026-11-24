import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BomNService } from '../../../../Services/BomN/bomn.service';
import { BomN, PageInfo } from '../../../../Types/bomn.types';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-bomn',
  templateUrl: './bomn.component.html',
  styleUrls: ['./bomn.component.css'],
  standalone: false

})
export class BomNComponent implements OnInit, OnDestroy {
  // State
  bomNData: BomN[] = [];
  filteredBomNData: BomN[] = [];
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
  readonly pageSize = 10;

  // Months for dynamic columns
  months: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Columns for filtering
  columns: string[] = [
    'codeproduit', 'categorieProduit', 'libellesPf', 'taillelot',
    'article', 'libellesMp', 'qteBesoin', 'unite',
    ...this.months.flatMap(month => [`Reste à lancer en ${month}`, `Besoin MP pour reste ${month}`])
  ];

  isLoading = false;


  constructor(
    private bomNService: BomNService,
    private location: Location,
    private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef
  ) {
    this.setupSearchSubscription();
    this.initializeFilters();
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.bomNService.generateBomN(currentYear).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Erreur lors de la mutation generateBomN:', err);
        this.loadData();
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
    // Activons le spinner avant de charger les données
    this.isLoading = true;

    this.bomNService.getBomNPages(this.currentPage, this.pageSize, this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.bomNData = [...response.content];
          this.applyFilters();
          this.pageInfo = response.pageInfo;
          // Désactivons le spinner une fois les données chargées
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Une erreur est survenue lors du chargement des données. Veuillez réessayer.';
          console.error('Erreur lors du chargement des données:', err);
          // Désactivons également le spinner en cas d'erreur
          this.isLoading = false;
          this.cdr.detectChanges();
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

  getResteLancer(bomN: BomN, month: string): number {
    const entry = bomN.resteLancerParMois?.find(entry => entry.month === month);
    return entry ? entry.value : 0;
  }

  getBesoinMpMois(bomN: BomN, month: string): number {
    const entry = bomN.besoinMpParMois?.find(entry => entry.month === month);
    return entry ? entry.value : 0;
  }

  applyFilters(): void {
    this.filteredBomNData = this.bomNData.filter(item => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key].toLowerCase().trim();
        if (!filterValue) return true;
        const itemValue = String(item[key as keyof BomN] || '').toLowerCase();
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
