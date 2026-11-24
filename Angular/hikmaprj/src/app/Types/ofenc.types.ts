
export interface Ofenc {
    numOrdre: String;
    statutOrdre: Number;
    dateCreation: String;
    article: String;
    section: String;
    designation: String;
    designation2: String;
    lot: String;
    quantiteLct: Number;
    quantiteRestante: Number;
    destinationOF: String
  }
  
  export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  export interface OfencResponse {
    content: Ofenc[];
    pageInfo: PageInfo;
  }
  