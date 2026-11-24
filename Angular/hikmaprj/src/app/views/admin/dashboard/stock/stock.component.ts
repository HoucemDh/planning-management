import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { StockService } from '../../../../Services/Stock/stock.service';
import { Stock, PageInfo } from '../../../../Types/stock.types';
import { AuthService } from '../../../../Services/auth/auth.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  standalone: false
})
export class StockComponent implements OnInit, OnDestroy {
  stockData: Stock[] = [];
  filteredStockData: Stock[] = [];
  pageInfo: PageInfo | null = null;
  error: string | null = null;
  searchQuery = '';
  filters: { [key: string]: string } = {};
  showFilter: { [key: string]: boolean } = {};
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  currentPage = 0;
  readonly pageSize = 10;
  isLoading = false;
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedMonth: string = '';
  threshold: number = 10; // Par exemple, définissez un seuil par défaut
  lastUpdateDate: Date | null = null;

  displayColumns = [
    'article', 'designation', 'Unite', 'Famille', 'QuantiteA', 'QuantiteAC', 'SommeA_AC',
    'QuantiteQ', 'QuantiteQPR', 'OFPlanifie', 'OFSuggere', 'SommeOFFerme', 'sommeDA', 'SommeCDE',
    'UniteStock', 'NBlinge', 'Qinimum', 'PMP', 'Pays', 'Leadtime', 'Stocksecurite'
  ];

  // Utilisez des noms de mois en majuscules pour être cohérent avec le backend
  monthsForSelectedYear: string[] = [
    'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
    'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
  ];


  item: any;

  convertToString(value: any): string {
    return String(value);
  }


  constructor(
    private stockService: StockService,
    private location: Location,
    private authService:AuthService
  ) {
    this.setupSearchSubscription();
    this.displayColumns.forEach(column => {
      this.filters[column] = '';
      this.showFilter[column] = false;
    });
    this.initializeYears();
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
      debounceTime(500),
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
    this.isLoading = true;
    this.error = null;
    this.stockService.getStockPages(this.currentPage, this.pageSize, this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stockData = response.content.map(item => ({ ...item }));
          this.stockData.forEach(item => {
            // 1) besoins & stkFin brut (monthlyNeeds)
            if (item.monthlyNeeds && item.monthlyNeeds.length) {
              item.monthlyNeeds.forEach((need: any) => {
                const M = need.month.toUpperCase();
                item[`besoin_${M}`] = need.value;
                item[`stockFin_${M}`] = need.stockFinMois;
              });
            } else {
              this.monthsForSelectedYear.forEach(m => {
                item[`besoin_${m}`] = 0;
                item[`stockFin_${m}`] = item['Dispo_Of'] || 0;
              });
            }

            // 2) stk fin mois inclus liv (stockFinMoisInclusLiv map)
            if (item.stockFinMoisInclusLiv && item.stockFinMoisInclusLiv.length) {
              item.stockFinMoisInclusLiv.forEach((q: any) => {
                const [en, year] = q.mois.split('-');               // ex: "mar-2025"
                const moisFr = this.translateMonth(en).toUpperCase();

                // Assurez-vous que toutes les propriétés sont correctement extraites
                item[`stockFinLiv_${moisFr}`] = q.quantiteUs;
                item[`stockFinMois_${moisFr}`] = q.stockFinMois;
                item[`stockFinMoisInclusLiv_${moisFr}`] = q.stockFinMoisInclusLiv;

              });
                }
                // s'assurer que chaque colonne existe
                this.monthsForSelectedYear.forEach(m => {
                  if (item[`stockFinLiv_${m}`] == null) {
                    item[`stockFinLiv_${m}`] = 0;
                  }
                  if (item[`stockFinMoisInclusLiv_${m}`] == null) {
                    item[`stockFinMoisInclusLiv_${m}`] = 0;
                  }
                });
          });

          this.applyFilters();
          this.pageInfo = response.pageInfo;
          this.lastUpdateDate = new Date();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des données.';
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  private translateMonth(m: string): string {
    const map: {[key: string]: string} = {
      jan: 'janvier', feb: 'février', mar: 'mars',   apr: 'avril',
      may: 'mai',     jun: 'juin',     jul: 'juillet',aug: 'août',
      sep: 'septembre',oct: 'octobre', nov: 'novembre',dec: 'décembre'
    };
    return map[m.toLowerCase()] || m;
  }


  toggleFilter(column: string, event: Event): void {
    event.stopPropagation();
    this.showFilter[column] = !this.showFilter[column];
  }

  applyFilters(): void {
    this.filteredStockData = this.stockData.filter(item => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key].toLowerCase().trim();
        if (!filterValue) return true;
        const itemValue = String(item[key as keyof Stock] || '').toLowerCase();
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

  onPageChange(page: number): void {
    if (page !== this.currentPage && page >= 0 && (!this.pageInfo || page < this.pageInfo.totalPages)) {
      this.currentPage = page;
      this.loadData();
    }
  }

  getVisiblePages(): (number | string)[] {
    if (!this.pageInfo || this.pageInfo.totalPages < 2) return [];
    const totalPages = this.pageInfo.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [0];

    if (current > 3) pages.push('...');
    for (let i = Math.max(1, current - 1); i <= Math.min(current + 1, totalPages - 2); i++) {
      pages.push(i);
    }
    if (current < totalPages - 4) pages.push('...');
    if (totalPages > 1) pages.push(totalPages - 1);

    return pages;
  }

  isEllipsis(page: number | string): boolean {
    return page === '...';
  }

  getPageNumber(page: number | string): number {
    return typeof page === 'number' ? page : 0;
  }

  goBack(): void {
    this.location.back();
  }

  updateAllStockValuesForYearAndMonth(year: number, month: string): void {
    this.stockService.updateAllStockValuesForYearAndMonth(year, month).subscribe({
      next: (success) => {
        if (success) {
          alert(`Mise à jour du stock pour ${month} ${year} réussie.`);
          this.loadData();
          location.reload(); // Recharge complètement la page
        } else {
          alert('Échec de la mise à jour.');
        }
      },
      error: () => alert('Erreur lors de la mise à jour.')
    });
  }

  onYearChange(): void {
    this.loadData();
  }

  synchronizeYearData(): void {
    this.isLoading = true;
    const currentYear = new Date().getFullYear();
    this.stockService.updateAllBesoinMoisForYear(currentYear).subscribe({
      next: (success) => {
        if (success) {
          this.loadData();
          alert(`Synchronisation des besoins pour l'année ${currentYear} réussie.`);
        } else {
          alert('Échec de la synchronisation.');
        }
        this.isLoading = false; // Réactive le bouton et arrête l'animation
      },
      error: (err) => {
        alert('Erreur lors de la synchronisation.');
        console.error('Erreur:', err);
        this.isLoading = false; // Réactive le bouton en cas d'erreur
      }
    });
  }

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  updateBesoinMoisForArticle(articleCode: string): void {
    const currentYear = new Date().getFullYear(); // Récupérer l'année actuelle
    this.isLoading = true; // Désactive le bouton pendant l'exécution

    this.stockService.updateBesoinMoisForArticle(currentYear, articleCode).subscribe({
      next: (updatedStock) => {
        this.isLoading = false; // Réactive le bouton une fois l'action terminée
        if (updatedStock) {
          alert(`Mise à jour de l'article ${articleCode} réussie.`);
          this.loadData(); // Recharger les données après la mise à jour
          location.reload(); // Recharge la page entière après la mise à jour
        } else {
          alert(`Échec de la mise à jour de l'article ${articleCode}.`);
        }
      },
      error: () => {
        this.isLoading = false; // Réactive le bouton en cas d'erreur
        alert(`Erreur lors de la mise à jour de l'article ${articleCode}.`);
      }
    });
  }

    // Check if user has permission to export or update
  get canExportOrUpdate(): boolean {
    return this.authService.isAdmin() || this.authService.isPlanner();
  }

 exportExcel() {
    this.stockService.exportNegativeStocksExcel().subscribe(base64Data => {
    console.log('Base64 reçue :', base64Data);
    if (!base64Data) {
      alert('Erreur lors de l\'export');
      return;
    }

      // Convertir base64 en Blob
      const binary = atob(base64Data);
      const array = [];
      for(let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }


}
