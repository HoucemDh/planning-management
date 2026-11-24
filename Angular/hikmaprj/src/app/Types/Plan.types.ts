
export interface Produit {
  id: string;
  libelle: string;
  reference: string;
  tailleLot: number;
}

export interface Plan {
  id: number;
  ref: string;
  libelle: string;
  mois: string;
  prevueLancer: number;
  lancerActuelle: number;
  resteLancer: number;
  tailleLot: number;
  year: number;
  produit: Produit;
}

export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PlanResponse {
  content: Plan[];
  pageInfo: PageInfo;
}

export interface NewPlan {
  ref: string;
  libelle: string;
  tailleLot: number;
  year: number;
  selectedMonth: string;
  prevueLancer: number;
  lancer: number;
  resteLancer: number;
}
