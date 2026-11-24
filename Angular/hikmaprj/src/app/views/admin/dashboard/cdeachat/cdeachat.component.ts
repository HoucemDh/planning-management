import { Component, OnDestroy, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CdeachatService } from '../../../../Services/CdeAchat/cdeachat.service';
import { Cdeachat, PageInfo } from '../../../../Types/cdeachat.types';

@Component({
  selector: 'app-Cdeachat',
  templateUrl: './cdeachat.component.html',
  styleUrls: ['./cdeachat.component.css'],
  standalone: false
})
export class CdeachatComponent implements OnInit, OnDestroy {
  // State
  CdeachatData: Cdeachat[] = [];
  filteredCdeachatData: Cdeachat[] = [];
  pageInfo: PageInfo | null = null;
  error: string | null = null;
  successMessage: string | null = null;
  showSuccessPopup = false;

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
    'noCommande', 'article', 'dateCommande', 'dateReceptPrevue', 'fournisseur',
    'raisonSociale', 'designation', 'quantiteUa', 'quantiteUs', 'uniteAchat',
    'resteLivrer', 'devise', 'prixBrut', 'montantLigne', 'pays', 'conditionPaiement',
    'ligneSoldee', 'soldeReception', 'qteReceptUa', 'qteFactureUa', 'resteLivrerUs',
    'modeLivraison', 'typeAchat', 'pieceOrigine', 'categorie', 'facturee', 'imprimee',
    'signee', 'dateConfirmFrs', 'dateRecFacture', 'dateDocTransport', 'dateEmbarquement',
    'datePrevueArrPort', 'dateAvisArrivee', 'dateRecSite', 'mois', 'dateCalcul'
  ];

  constructor(
    private CdeachatService: CdeachatService,
    private location: Location,
    private cdr: ChangeDetectorRef
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
    this.successMessage = null;

    this.CdeachatService.getCdeAchatPages(
      this.currentPage,
      this.pageSize,
      this.searchQuery
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.CdeachatData = [...response.content];
        this.applyFilters();
        this.pageInfo = response.pageInfo;
        this.cdr.detectChanges();
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

  onCalculateFields(): void {
    this.CdeachatService.calculateFieldsForAll().subscribe({
      next: (response) => {
        console.log('Champs calculés avec succès', response);
        this.successMessage = 'Calcul effectué avec succès';
        this.showSuccessPopup = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.error = 'An error occurred while calculating fields. Please try again.';
        console.error('Error calculating fields:', err);
        this.cdr.detectChanges();
      }
    });
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
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

  applyFilters(): void {
    this.filteredCdeachatData = this.CdeachatData.filter(item => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key].toLowerCase().trim();
        if (!filterValue) return true;
        const itemValue = String(item[key as keyof Cdeachat] || '').toLowerCase();
        return itemValue.includes(filterValue);
      });
    });
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
