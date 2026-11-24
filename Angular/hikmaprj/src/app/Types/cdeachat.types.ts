export interface Cdeachat {
    noCommande: String
    dateCommande: String
    dateReceptPrevue: String
    fournisseur: String
    raisonSociale: String
    article: String
    designation: String
    quantiteUa: number
    quantiteUs: number
    uniteAchat: String
    resteLivrer: number
    devise: String
    prixBrut: number
    montantLigne: number
    pays: String
    conditionPaiement: String
    ligneSoldee: number
    soldeReception: number
    qteReceptUa: number
    qteFactureUa: number
    resteLivrerUs: number
    modeLivraison: String
    typeAchat: number
    pieceOrigine: String
    categorie: String
    facturee: number
    imprimee: number
    signee: number
    dateConfirmFrs: String
    dateRecFacture: String
    dateDocTransport: String
    dateEmbarquement: String
    datePrevueArrPort: String
    dateAvisArrivee: String
    dateRecSite: String
    mois: String;        // Colonne pour le mois calculé
    dateCalcul: String;
  }

  export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }

  export interface CdeachatResponse {
    content: Cdeachat[];
    pageInfo: PageInfo;
  }
