export interface Globalstock{
    article: String
    designation: String
    categorie: String
    quantiteUS: Number
    uniteStock: String
    quantiteActiveUS: Number
    quantiteAllouee: Number
    dateMVT: String
    lot: String
    sLot: String
    identifiant: String
    identifiant2: String
    emplacement: String
    statut: String
    lotFournisseur: String
    datePeremption: String
    dateRecontrole: String
    demandeAnalyse: String
    quantiteUC: Number
    coefUCUS: Number
}


export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface globalStockResponse {
    content : Globalstock [];
    pageInfo : PageInfo;
}
