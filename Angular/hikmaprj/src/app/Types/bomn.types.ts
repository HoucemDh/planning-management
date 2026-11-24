export interface BomN {
  id: string;
  codeproduit?: string;
  categorieProduit?: string;
  libellesPf?: string;
  taillelot?: number;
  article?: string;
  libellesMp?: string;
  qteBesoin?: number;
  unite?: string;
  resteLancer?: number;
  besoinMpMois?: number;
  pdp: Plan;
  bom: Bom;

  resteLancerParMois?: MonthValue[];
  besoinMpParMois?: MonthDecimalValue[];
}

export interface MonthValue {
  month: string;
  value: number;
}

export interface MonthDecimalValue {
  month: string;
  value: number;
  year:number;
  codeProduit:string;
}

export interface Bom {
  id_bom: string;
  codeproduit?: string;
  BOM_Alternative?: number;
  Categorie_Produit?: string;
  libellesPF?: string;
  taillelot?: number;
  article?: string;
  libellesMP?: string;
  Qte_besoin?: number;
  unite?: string;
}

export interface Plan {
  id: string;
  ref?: string;
  libelle?: string;
  mois?: string;
  prevueLancer?: number;
  lancerActuelle?: number;
  resteLancer?: number;
  tailleLot?: number;
  year?: number;
  produit?: Produit;
}

export interface Produit {
  id: number;
  libelle: string;
  reference: string;
  tailleLot: number;
}



export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PagedResponseBomN {
  content: BomN[];
  pageInfo: PageInfo;
}
