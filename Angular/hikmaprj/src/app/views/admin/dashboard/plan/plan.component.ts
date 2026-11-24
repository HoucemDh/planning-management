import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PlanService } from '../../../../Services/Pdp/plan.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../Services/auth/auth.service';

interface Produit {
  id: string;
  libelle: string;
  reference: string;
  tailleLot: number;
}

interface PlanMonth {
  prevueLancer: number;
  lancer: number;
  resteLancer: number;
}

interface Plan {
  id: string;
  libelle: string;
  tailleLot: number;
  year: number;
  monthlyData: { [month: string]: PlanMonth };
  produit: Produit;
}

interface SelectedProduct {
  productLibelle: string;
  productId: string;
}

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PlanService, Location],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
})
export class PlanComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('yearScroll') yearScroll!: ElementRef;
  plans: Plan[] = [];
  months: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  newPlan: {
    libelle: string;
    reference: string; // Ajout de cette ligne
    tailleLot: number;
    year: number;
    selectedMonth: string;
    prevueLancer: number;
    lancer: number;
    resteLancer: number;
  } = {
    libelle: '',
    reference: '', // Ajout de cette ligne
    tailleLot: 0,
    year: new Date().getFullYear(),
    selectedMonth: '',
    prevueLancer: 0,
    lancer: 0,
    resteLancer: 0
  };

  selectedProduct: SelectedProduct | null = null;
  libelles: string[] = [];
  searchQuery = '';
  error: string | null = null;
  showPopup = false;
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  isScrollStart = true;
  isScrollEnd = false;
  currentPage: number = 1;
  itemsPerPage: number = 8;

  showUpdatePopup = false;
  planToUpdate: any = {};
  filteredLibelles: string[] = [];

  // Filters
  filters: { [key: string]: string } = {};
  showFilter: { [key: string]: boolean } = {};

  // Columns for filtering
  columns: string[] = [
    'Référence', 'Libellé', 'Taille Lot'
  ];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef, private planService: PlanService, private location: Location, private authservice : AuthService) {
    this.setupSearchSubscription();
  }

  allPlans: Plan[] = [];

  ngOnInit() {
    this.loadYears();
    this.loadData();
    this.loadLibelles();
    this.initializeFilters();
  }

  ngAfterViewInit() {
    this.checkScrollPosition();
    this.updateScrollbarPosition();
    this.initScrollListener();
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
      this.loadData();
    });
  }

  get canAddOrUpdate() : boolean{
    return this.authservice.isAdmin() || this.authservice.isPlanner();
  }
  loadYears(): void {
    this.planService.getPlans().subscribe(
      (result: any[]) => {
        const years = new Set(result.map(plan => plan.year));
        this.availableYears = Array.from(years).sort((a, b) => b - a);
        if (!this.availableYears.includes(this.selectedYear)) {
          this.selectedYear = this.availableYears[0];
          this.loadData();
        }
      },
      (err) => {
        this.showError ('Une erreur est survenue lors du chargement des années. Veuillez réessayer.');
        console.error('Erreur de chargement des années:', err);
      }
    );
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.loadData();
  }

  loadData(): void {
    this.planService.getPlansByYear(this.selectedYear).subscribe(
      (result: any[]) => {
        const plansByProduct = result.reduce((acc: { [key: string]: any[] }, plan) => {
          const productKey = `${plan.produit.libelle}-${plan.produit.id}`;
          if (!acc[productKey]) {
            acc[productKey] = [];
          }
          acc[productKey].push(plan);
          return acc;
        }, {});

        this.plans = Object.values(plansByProduct).map(productPlans => {
          const firstPlan = productPlans[0];
          const plan: Plan = {
            id: firstPlan.id,
            libelle: firstPlan.libelle,
            tailleLot: firstPlan.tailleLot,
            year: firstPlan.year,
            monthlyData: {},
            produit: {
              id: firstPlan.produit.id,
              libelle: firstPlan.produit.libelle,
              reference: firstPlan.produit.reference,
              tailleLot: firstPlan.produit.tailleLot
            }
          };

          productPlans.forEach(p => {
            plan.monthlyData[p.mois] = {
              prevueLancer: p.prevueLancer,
              lancer: p.lancerActuelle,
              resteLancer: Math.max(p.prevueLancer - p.lancerActuelle, 0)
            };
          });

          return plan;
        });

        this.allPlans = [...this.plans];
        this.applyFilters();
        this.currentPage = 1;

        console.log('Updated Plans:', this.plans);
      },
      (err) => {
        this.error = 'Une erreur est survenue lors du chargement des données. Veuillez réessayer.';
        console.error('Erreur de chargement des données:', err);
      }
    );
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;

    // Si la recherche est vide, charger toutes les données
    if (!this.searchQuery.trim()) {
      this.loadData();
      return;
    }

    // Utiliser le service de recherche
    this.planService.searchPlans(this.selectedYear, this.searchQuery)
      .subscribe(
        (result: any[]) => {
          const plansByProduct = result.reduce((acc: { [key: string]: any[] }, plan) => {
            const productKey = `${plan.produit.reference}-${plan.produit.id}`;
            if (!acc[productKey]) {
              acc[productKey] = [];
            }
            acc[productKey].push(plan);
            return acc;
          }, {});

          this.plans = Object.values(plansByProduct).map(productPlans => {
            const firstPlan = productPlans[0];
            const plan: Plan = {
              id: firstPlan.id,
              libelle: firstPlan.libelle,
              tailleLot: firstPlan.tailleLot,
              year: firstPlan.year,
              monthlyData: {},
              produit: {
                id: firstPlan.produit.id,
                libelle: firstPlan.produit.libelle,
                reference: firstPlan.produit.reference,
                tailleLot: firstPlan.produit.tailleLot
              }
            };

            productPlans.forEach(p => {
              plan.monthlyData[p.mois] = {
                prevueLancer: p.prevueLancer,
                lancer: p.lancerActuelle,
                resteLancer: Math.max(p.prevueLancer - p.lancerActuelle, 0)
              };
            });

            return plan;
          });
        },
        (error) => {
          this.error = 'Une erreur est survenue lors de la recherche';
          console.error('Erreur de recherche:', error);
        }
      );
  }

  getVisiblePages(): (number | string)[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  isEllipsis(page: number | string): boolean {
    return page === '...';
  }

  getPageNumber(page: number | string): number {
    return typeof page === 'number' ? page : 0;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  filterPlans(): void {
    if (this.searchQuery) {
      this.plans = this.allPlans.filter(plan =>
        plan.libelle.includes(this.searchQuery) ||
        Object.values(plan.monthlyData).some(monthData =>
          monthData.prevueLancer.toString().includes(this.searchQuery) ||
          monthData.lancer.toString().includes(this.searchQuery) ||
          monthData.resteLancer.toString().includes(this.searchQuery)
        )
      );
    } else {
      this.plans = [...this.allPlans];
    }
  }

  get paginatedPlans(): Plan[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.plans.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.plans.length / this.itemsPerPage);
  }

  changePage(direction: number): void {
    this.currentPage += direction;
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  loadLibelles(): void {
    this.planService.getLibelles().subscribe(
      (libelles: string[]) => {
        this.libelles = libelles;
      },
      (err) => {
        console.error('Erreur de chargement des libellés:', err);
      }
    );
  }

  onLibelleChange(libelle: string): void {
    if (libelle) {
      this.planService.getProductByLibelle(libelle).subscribe(
        (product: Produit) => {
          if (product) {
            this.newPlan.libelle = product.libelle;
            this.newPlan.reference = product.reference; // Ajout de cette ligne
            this.newPlan.tailleLot = product.tailleLot;
            this.selectedProduct = {
              productLibelle: product.libelle,
              productId: product.id
            };
          }
        },
        (error: Error) => {
          console.error('Erreur lors de la récupération des détails du produit:', error);
          this.showError ('Erreur lors de la récupération des détails du produit');
          this.selectedProduct = null;
        }
      );
    } else {
      this.newPlan.libelle = '';
      this.newPlan.reference = ''; // Ajout de cette ligne
      this.newPlan.tailleLot = 0;
      this.selectedProduct = null;
    }
  }

  private isMonthUsedByLibelle(libelle: string, month: string, year: number): boolean {
    if (!this.selectedProduct) return false;

    return this.plans.some(plan =>
      plan.produit.libelle === this.selectedProduct?.productLibelle &&
      plan.produit.id === this.selectedProduct?.productId &&
      plan.year === year &&
      plan.monthlyData[month] !== undefined
    );
  }

  getMonthStatus(month: string): {
    disabled: boolean;
    isUsedByOtherLibelle: boolean;
    isUsedByCurrentLibelle: boolean;
    isPast: boolean;
  } {
    if (!this.newPlan.libelle || !this.newPlan.year || !this.selectedProduct) {
      return {
        disabled: false,
        isUsedByOtherLibelle: false,
        isUsedByCurrentLibelle: false,
        isPast: this.isMonthInPast(month, this.newPlan.year)
      };
    }

    const isUsedByCurrentLibelle = this.isMonthUsedByLibelle(this.newPlan.libelle, month, this.newPlan.year);
    const isUsedByOtherLibelle = this.plans.some(plan =>
      (plan.produit.libelle !== this.selectedProduct?.productLibelle ||
       plan.produit.id !== this.selectedProduct?.productId) &&
      plan.year === this.newPlan.year &&
      plan.monthlyData[month] !== undefined
    );
    const isPast = this.isMonthInPast(month, this.newPlan.year);

    return {
      disabled: isUsedByCurrentLibelle || isPast,
      isUsedByOtherLibelle: isUsedByOtherLibelle,
      isUsedByCurrentLibelle: isUsedByCurrentLibelle,
      isPast: isPast
    };
  }

  updateMonthFields(): void {
    this.newPlan.resteLancer = Math.max(
      this.newPlan.prevueLancer - this.newPlan.lancer,
      0
    );
  }

  isMonthDisabled(month: string): boolean {
    if (!this.newPlan.libelle || !this.newPlan.year || !this.selectedProduct) {
      return this.isMonthInPast(month, this.newPlan.year);
    }

    return this.isMonthUsedByLibelle(this.newPlan.libelle, month, this.newPlan.year) ||
           this.isMonthInPast(month, this.newPlan.year);
  }

  addPlan() {
    if (!this.newPlan.selectedMonth) {
      this.showError ('Veuillez sélectionner un mois');
      return;
    }

    if (this.isMonthDisabled(this.newPlan.selectedMonth)) {
      if (this.isMonthInPast(this.newPlan.selectedMonth, this.newPlan.year)) {
        this.showError('Impossible d\'ajouter un plan pour un mois passé');
      } else {
        this.showError('Ce mois est déjà utilisé pour ce libellé');
      }
      return;
    }

    this.planService.addPlan(
      this.newPlan.libelle,
      this.newPlan.selectedMonth,
      this.newPlan.prevueLancer,
      this.newPlan.lancer,
      this.newPlan.tailleLot,
      this.newPlan.year
    ).subscribe(
      (response: any) => {
        const newPlanData = response.data.addPlan;

        const existingPlan = this.plans.find(p =>
          p.produit.libelle === newPlanData.produit.libelle &&
          p.produit.id === newPlanData.produit.id
        );

        if (existingPlan) {
          existingPlan.monthlyData[newPlanData.mois] = {
            prevueLancer: newPlanData.prevueLancer,
            lancer: newPlanData.lancerActuelle,
            resteLancer: Math.max(newPlanData.prevueLancer - newPlanData.lancerActuelle, 0)
          };
        } else {
          const newPlan: Plan = {
            id: newPlanData.id,
            libelle: newPlanData.libelle,
            tailleLot: newPlanData.tailleLot,
            year: newPlanData.year,
            monthlyData: {
              [newPlanData.mois]: {
                prevueLancer: newPlanData.prevueLancer,
                lancer: newPlanData.lancerActuelle,
                resteLancer: Math.max(newPlanData.prevueLancer - newPlanData.lancerActuelle, 0)
              }
            },
            produit: newPlanData.produit
          };
          this.plans.push(newPlan);
        }

        this.resetNewPlan();
        this.togglePopup();
      },
      (error) => {
        this.showError ('Erreur lors de l\'ajout du plan');
        console.error('Erreur d\'ajout:', error);
      }
    );
  }

  resetNewPlan() {
    this.newPlan = {
      libelle: '',
      reference: '', // Ajout de cette ligne
      tailleLot: 0,
      year: new Date().getFullYear(),
      selectedMonth: '',
      prevueLancer: 0,
      lancer: 0,
      resteLancer: 0
    };
    this.selectedProduct = null;
  }

  goBack(): void {
    this.location.back();
  }

  togglePopup(): void {
    this.showPopup = !this.showPopup;
    if (!this.showPopup) {
      this.resetNewPlan();
    }
  }

  closePopupOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'popup') {
      this.togglePopup();
    }
  }

  scrollYears(direction: 'left' | 'right') {
    const container = this.yearScroll.nativeElement;
    const scrollAmount = container.clientWidth * 0.8;

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    setTimeout(() => {
      this.checkScrollPosition();
      this.updateScrollbarPosition();
    }, 100);
  }

  checkScrollPosition() {
    const container = this.yearScroll.nativeElement;
    this.isScrollStart = container.scrollLeft <= 0;
    this.isScrollEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;
  }

  updateScrollbarPosition() {
    const container = this.yearScroll.nativeElement;
    const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
    const scrollbarWidth = (container.clientWidth / container.scrollWidth) * 100;

    container.style.setProperty('--scroll-left', `${scrollPercentage}%`);
    container.style.setProperty('--scroll-width', `${scrollbarWidth}%`);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScrollPosition();
    this.updateScrollbarPosition();
  }

  initScrollListener() {
    const container = this.yearScroll.nativeElement;
    container.addEventListener('scroll', () => {
      this.checkScrollPosition();
      this.updateScrollbarPosition();
    });
  }


  filterLibelles() {
    const query = this.newPlan.libelle.toLowerCase();
    this.filteredLibelles = this.libelles.filter(libelle =>
      libelle.toLowerCase().includes(query)
    );
  }

  selectLibelle(libelle: string) {
    this.newPlan.libelle = libelle;
    this.filteredLibelles = [];
    this.onLibelleChange(libelle);
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
    console.log('Applying filters with:', this.filters); // Debugging log
    this.plans = this.allPlans.filter(plan => {
      return Object.keys(this.filters).every(key => {
        const filterValue = this.filters[key].toLowerCase().trim();
        if (!filterValue) return true;

        let itemValue = '';
        switch(key) {
          case 'Référence':
            itemValue = plan.produit.reference.toLowerCase();
            break;
          case 'Libellé':
            itemValue = plan.produit.libelle.toLowerCase();
            break;
          case 'Taille Lot':
            itemValue = plan.produit.tailleLot.toString().toLowerCase();
            break;
          default:
            itemValue = '';
        }

        console.log(`Filtering ${key} with value "${filterValue}" against "${itemValue}"`); // Debugging log
        return itemValue.includes(filterValue);
      });
    });

    console.log('Filtered plans:', this.plans); // Debugging log
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




  openUpdatePopup(plans: Plan[]) {
    // Reset planToUpdate
    this.planToUpdate = {
      libelle: '',
      reference: '', // Ajout de cette ligne
      mois: '',
      year: this.selectedYear,
      prevueLancer: 0,
      lancerActuelle: 0
    };

    this.showUpdatePopup = true;
    this.filteredLibelles = [...this.libelles]; // Afficher tous les libellés au départ
  }

   // Method to close the update popup
   closeUpdatePopup() {
    this.showUpdatePopup = false;
    this.planToUpdate = {};
    this.filteredLibelles = [];
  }


// Method to handle the update form submission
updatePlan() {
   // Vérifier d'abord si les données existent
   if (!this.planToUpdate.dataExists) {
    this.showError("Impossible de modifier: aucune donnée existante pour ce libellé et ce mois");
    return;
  }
  // Convert string values to appropriate types
  const year = parseInt(this.planToUpdate.year.toString(), 10);
  const prevueLancer = parseInt(this.planToUpdate.prevueLancer.toString(), 10);
  const lancerActuelle = parseInt(this.planToUpdate.lancerActuelle.toString(), 10);
  const mois = this.planToUpdate.mois; // Assuming mois is a string, e.g., "Août"


  // Vérifier si le mois est passé
  if (this.isMonthInPast(mois, year)) {
    this.showError("Impossible de modifier un plan pour un mois passé");
    return;
  }
  // Log the values being sent
  console.log('Updating plan with values:', {
    libelle: this.planToUpdate.libelle,
    year,
    mois,
    prevueLancer,
    lancerActuelle
  });

  // Validate parameters before sending the mutation
  if (isNaN(year) || isNaN(prevueLancer) || isNaN(lancerActuelle)) {
    this.showError ( "Les paramètres de l'année ou des quantités sont invalides.");
    return;
  }

  // Call the service with the exact parameters expected by the GraphQL mutation
  this.planService.updatePlan(
    this.planToUpdate.libelle,
    year,
    mois,
    prevueLancer,
    lancerActuelle
  ).subscribe(
    response => {
      console.log('Plan updated successfully', response);
      this.closeUpdatePopup();
      this.loadData(); // Refresh the data after update
    },
    error => {
      console.error('Error updating plan', error);

      // Enhanced error handling
      let errorMessage = "Une erreur est survenue lors de la mise à jour du plan.";

      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        console.error('GraphQL errors:', error.graphQLErrors);
        errorMessage = `Erreur GraphQL: ${error.graphQLErrors[0].message}`;
      }

      if (error.networkError) {
        console.error('Network error:', error.networkError);
        errorMessage = "Erreur de connexion au serveur.";
      }

      this.error = errorMessage;
    }
  );
}


// Dans la classe PlanComponent, modifiez la méthode selectLibelleForUpdate
selectLibelleForUpdate(libelle: string) {
  this.planToUpdate.libelle = libelle;
  this.filteredLibelles = [];

  // Get product details for the selected libelle
  this.planService.getProductByLibelle(libelle).subscribe(
    (product: Produit) => {
      if (product) {
        this.planToUpdate.tailleLot = product.tailleLot;
        this.planToUpdate.reference = product.reference;

        // Store product ID for the update
        this.planToUpdate.productId = product.id;

        // Chargez les plans pour ce produit et l'année sélectionnée
        this.loadPlansForProductAndYear(product.id, product.libelle, this.planToUpdate.year);
      }
    },
    (error: Error) => {
      console.error('Erreur lors de la récupération des détails du produit:', error);
      this.showError('Erreur lors de la récupération des détails du produit');
    }
  );
}

// Ajoutez une nouvelle méthode pour charger les plans d'un produit spécifique
loadPlansForProductAndYear(productId: string, libelle: string, year: number) {
  // Recherchez d'abord dans les plans existants
  const existingPlan = this.plans.find(plan =>
    plan.produit.id === productId &&
    plan.produit.libelle === libelle &&
    plan.year === year
  );

  if (existingPlan) {
    // Stockez le plan trouvé pour utilisation ultérieure
    this.planToUpdate.existingPlan = existingPlan;

    // Si un mois est déjà sélectionné, mettez à jour les valeurs
    if (this.planToUpdate.mois) {
      this.updateFieldsForMonth(this.planToUpdate.mois);
    }
  } else {
    // Si aucun plan n'est trouvé localement, vous pourriez faire une requête au serveur
    // Mais ce n'est généralement pas nécessaire car les plans sont déjà chargés par année
    this.planToUpdate.existingPlan = null;
  }
}

// Ajoutez une méthode pour mettre à jour les champs quand le mois est sélectionné
updateFieldsForMonth(month: string): boolean {
  if (!this.planToUpdate.existingPlan) {
    this.showError(`Aucun plan existant pour le libellé "${this.planToUpdate.libelle}"`);
    return false;
  }

  const monthData = this.planToUpdate.existingPlan.monthlyData[month];

  if (monthData) {
    // Pré-remplir les champs avec les valeurs existantes
    this.planToUpdate.prevueLancer = monthData.prevueLancer;
    this.planToUpdate.lancerActuelle = monthData.lancer;
    return true;
  } else {
    // Réinitialiser les champs si aucune donnée n'existe pour ce mois
    this.planToUpdate.prevueLancer = 0;
    this.planToUpdate.lancerActuelle = 0;
    this.showError(`Aucune donnée existante pour ${month} ${this.planToUpdate.year} avec le libellé "${this.planToUpdate.libelle}"`);
    return false;
  }
}

// Ajoutez une méthode pour gérer les changements de mois
onUpdateMonthChange(month: string) {
  this.planToUpdate.mois = month;
  const dataExists = this.updateFieldsForMonth(month);
  this.planToUpdate.dataExists = dataExists;
}

// Variable pour suivre si la notification est visible
showNotification = false;

// Afficher une erreur dans la bannière
showError(message: string, autoHide: boolean = true): void {
  this.error = message;
  this.showNotification = true;

  // Fermer automatiquement après 5 secondes si autoHide est true
  if (autoHide) {
    setTimeout(() => {
      this.closeErrorNotification();
    }, 5000);
  }
}

// Fermer la notification
closeErrorNotification(): void {
  this.error = null;
  this.showNotification = false;
}

// Nouvel état pour le popup d'ajout multiple
showMultiAddPopup = false;

// Nouvel objet pour l'ajout de plans multiples
multiPlan = {
  libelle: '',
  reference: '',
  tailleLot: 0,
  year: new Date().getFullYear(),
  monthPlans: this.months.map(month => ({
    month,
    prevueLancer: 0,
    lancer: 0,
    resteLancer: 0,
    isEnabled: true
  }))
};

// Méthode pour ouvrir/fermer le popup d'ajout multiple
toggleMultiAddPopup(): void {
  this.showMultiAddPopup = !this.showMultiAddPopup;
  if (this.showMultiAddPopup) {
    this.filteredLibelles = [...this.libelles]; // Afficher tous les libellés au départ
  } else {
    this.resetMultiPlan();
  }
}

// Réinitialiser le formulaire d'ajout multiple
resetMultiPlan(): void {
  this.multiPlan = {
    libelle: '',
    reference: '',
    tailleLot: 0,
    year: new Date().getFullYear(),
    monthPlans: this.months.map(month => ({
      month,
      prevueLancer: 0,
      lancer: 0,
      resteLancer: 0,
      isEnabled: true
    }))
  };
  this.selectedProduct = null;
  this.filteredLibelles = [];
}

// Méthode pour sélectionner un libellé dans le formulaire d'ajout multiple
selectLibelleForMulti(libelle: string): void {
  this.multiPlan.libelle = libelle;
  this.filteredLibelles = [];

  this.planService.getProductByLibelle(libelle).subscribe(
    (product: Produit) => {
      if (product) {
        this.multiPlan.reference = product.reference;
        this.multiPlan.tailleLot = product.tailleLot;
        this.selectedProduct = {
          productLibelle: product.libelle,
          productId: product.id
        };

        // Mise à jour de l'état activé/désactivé des mois selon disponibilité
        this.updateMonthsAvailability();
      }
    },
    (error: Error) => {
      console.error('Erreur lors de la récupération des détails du produit:', error);
      this.showError('Erreur lors de la récupération des détails du produit');
      this.selectedProduct = null;
    }
  );
}

// Mettre à jour la disponibilité des mois pour l'ajout multiple
updateMonthsAvailability(): void {
  if (!this.selectedProduct) return;

  this.multiPlan.monthPlans.forEach(monthPlan => {
    // Vérifier si le mois est déjà utilisé pour ce libellé et cette année ou s'il est passé
    const isPast = this.isMonthInPast(monthPlan.month, this.multiPlan.year);

    monthPlan.isEnabled = !this.isMonthUsedByLibelle(
      this.selectedProduct?.productLibelle || '',
      monthPlan.month,
      this.multiPlan.year
    ) && !isPast;
  });
}
// Mettre à jour le champ "reste" pour un mois spécifique
updateMonthReste(monthIndex: number): void {
  const monthPlan = this.multiPlan.monthPlans[monthIndex];
  monthPlan.resteLancer = Math.max(
    monthPlan.prevueLancer - monthPlan.lancer,
    0
  );
}

// Ajouter plusieurs plans
addMultiplePlans(): void {
  // Filtrer les mois activés avec des données valides
  const monthsToAdd = this.multiPlan.monthPlans.filter(monthPlan =>
    monthPlan.isEnabled &&
    !this.isMonthUsedByLibelle(this.multiPlan.libelle, monthPlan.month, this.multiPlan.year) &&
    !this.isMonthInPast(monthPlan.month, this.multiPlan.year)
  );

  if (monthsToAdd.length === 0) {
    this.showError('Aucun mois valide à ajouter. Veuillez vérifier les mois sélectionnés.');
    return;
  }

  if (!this.multiPlan.libelle) {
    this.showError('Veuillez sélectionner un libellé');
    return;
  }

  // Compteur pour suivre les ajouts réussis
  let successCount = 0;
  let totalToAdd = monthsToAdd.length;

  // Pour chaque mois, ajouter un plan
  monthsToAdd.forEach(monthPlan => {
    this.planService.addPlan(
      this.multiPlan.libelle,
      monthPlan.month,
      monthPlan.prevueLancer,
      monthPlan.lancer,
      this.multiPlan.tailleLot,
      this.multiPlan.year
    ).subscribe(
      (response: any) => {
        successCount++;

        const newPlanData = response.data.addPlan;

        const existingPlan = this.plans.find(p =>
          p.produit.libelle === newPlanData.produit.libelle &&
          p.produit.id === newPlanData.produit.id
        );

        if (existingPlan) {
          existingPlan.monthlyData[newPlanData.mois] = {
            prevueLancer: newPlanData.prevueLancer,
            lancer: newPlanData.lancerActuelle,
            resteLancer: Math.max(newPlanData.prevueLancer - newPlanData.lancerActuelle, 0)
          };
        } else {
          const newPlan: Plan = {
            id: newPlanData.id,
            libelle: newPlanData.libelle,
            tailleLot: newPlanData.tailleLot,
            year: newPlanData.year,
            monthlyData: {
              [newPlanData.mois]: {
                prevueLancer: newPlanData.prevueLancer,
                lancer: newPlanData.lancerActuelle,
                resteLancer: Math.max(newPlanData.prevueLancer - newPlanData.lancerActuelle, 0)
              }
            },
            produit: newPlanData.produit
          };
          this.plans.push(newPlan);
        }

        // Si tous les plans ont été ajoutés
        if (successCount === totalToAdd) {
          this.showError(`${successCount} plans ont été ajoutés avec succès`, true);
          this.resetMultiPlan();
          this.toggleMultiAddPopup();
          this.loadData(); // Recharger les données
        }
      },
      (error) => {
        this.showError(`Erreur lors de l'ajout du plan pour ${monthPlan.month}`);
        console.error('Erreur d\'ajout:', error);
      }
    );
  });
}

// Fermer le popup d'ajout multiple sur clic overlay
closeMultiAddPopupOnOverlay(event: MouseEvent): void {
  if ((event.target as HTMLElement).className === 'popup') {
    this.toggleMultiAddPopup();
  }
}

// Ajouter cette méthode à la classe PlanComponent
isMonthInPast(month: string, year: number): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Index du mois dans le tableau this.months (0-11)
  const monthIndex = this.months.findIndex(m => m === month);

  // Un mois est considéré passé s'il est dans une année antérieure
  // ou s'il est dans l'année courante mais à un indice inférieur au mois actuel
  return (year < currentYear) || (year === currentYear && monthIndex < currentMonth);
}

filterLibellesForUpdate() {
  const query = this.planToUpdate.libelle.toLowerCase();
  this.filteredLibelles = this.libelles.filter(libelle =>
    libelle.toLowerCase().includes(query)
  );
}
filterLibellesForMulti() {
  const query = this.multiPlan.libelle.toLowerCase();
  this.filteredLibelles = this.libelles.filter(libelle =>
    libelle.toLowerCase().includes(query)
  );
}
}
