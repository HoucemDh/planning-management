export interface Cde{
  nocommande: String
  Date_commande: String
  Date_recept_prevue: String
  Fournisseur: String
  raisonsociale: String
  article: String
  Designation: String
  Quantite_UA: number
  Quantite_US: number
  Unite_achat: String
  Reste_livrer: number
  Devise: String
  Prix_brut: number
  Montant_ligne: number
  Pays: String
  Condition_paiement: String
  Ligne_soldee: number
  Solde_Reception: number
  Qte_Recept_UA: number
  Qte_Facture_UA: number
  Reste_livrer_US: number
  Mode_livraison: String
  Type_Achat: number
  Piece_Origine: String
  Categorie: String
  Facturee: number
  Imprimee: number
  Signee: number
  Date_confirm_frs: String
  Date_rec_facture: String
  Date_doc_transport: String
  Date_embarquement: String
  Date_prevue_arr_port: String
  Date_avis_arrivee: String
  Date_rec_site: String
  dispo_of: number
}
    export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }

  export interface CdeResponse {
    content: Cde[];
    pageInfo: PageInfo;
  }