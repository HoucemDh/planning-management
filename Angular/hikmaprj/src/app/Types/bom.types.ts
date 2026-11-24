export interface Bom{
  codeproduit: String
  BOM_Alternative: number
  Categorie_Produit: String
  libellesPF: String
  taillelot: number
  article: String
  libellesMP: String
  Qte_besoin: number
  unite: String
}
    export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }

  export interface BomResponse {
    content: Bom[];
    pageInfo: PageInfo;
  }
