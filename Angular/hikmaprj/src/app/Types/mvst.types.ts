
export interface Mvst {
    article: string;
    designation: string;
    Date_imputation: string;
    Quantite_US: number;
    Unite_stock: string;
    Quantite: number;
    Unite: string;
    statut: string;
    Lot: string;
    S_lot: string;
    Identifiant1: string;
    Identifiant2: string;
    Lot_fournisseur: string;
    Emplacement: string;
    Type_transaction: string;
    Tiers: string;
    Type_piece: string;
    Piece: string;
    Piece_origine: string;
    No_ligne_piece: string;
    Date_creation: string;
    Operateur_creation: string;
    Date_peremption: string;
    DLU: string;
    Affaire: string;
  }
  
  export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  export interface MvstResponse {
    content: Mvst[];
    pageInfo: PageInfo;
  }
  