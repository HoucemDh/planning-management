export interface Crltof {
    noOrdre: String;
    article: String;
    destinationOF: String;
    lot: String;
    statutOrdre: number;
    dateCreation: String;
    quantitePrevue: number;
    dateDebut: String;
    dateFin: String;
    qteRealiseeTot: number;
    qteRealiseeCQ: number;
    quantiteRestante: number;
    qteRealiseeRejetee: number;
    articlePF: String;
    statutMatiere: number;
    designation1: String;
    designation2: String;
    quantiteBesoin: number;
    quantiteAllouee: number;
    quantiteConsommee: number;
    ecartQteBesoinEtQteConsommee: number;
    statutAllocation1: number;
    datePremierSuivi: String;
    dateDernierSuivi: String;
    statutAllocation: number;
  }
  
  export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  export interface CrltofResponse {
    content: Crltof[];
    pageInfo: PageInfo;
  }
  