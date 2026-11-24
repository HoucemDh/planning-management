export interface Stock{
  [key: string]: any;
  article: String
  designation: String
  Unite: String
  Famille: String
  QuantiteA: number
  QuantiteAC: number
  SommeA_AC: number
  QuantiteQ: number
  QuantiteQPR: number
  OFPlanifie: number
  OFSuggere: number
  SommeOFFerme: number
  sommeDA: number
  SommeCDE: number
  UniteStock: String
  NBlinge: number
  Qinimum: number
  PMP: number
  Pays: String
  Leadtime: number
  Stocksecurite: number
  Dispo_Of: number
  besoin_actuelle: number
  stockFinMois: number
  monthlyNeeds?: MonthlyNeed[];
  stockFinMoisInclusLiv?: QuantiteUsParMois[];


  }

  export interface QuantiteUsParMois {
    mois: string;
    quantiteUs: number;
    stockFinMoisInclusLiv: number;

  }
  export interface MonthlyNeed {
    month: string;
    value: number;
    stockFinMois: number;

  }
      export interface PageInfo {
      pageNumber: number;
      pageSize: number;
      totalElements: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }

    export interface StockResponse {
      content: Stock[];
      pageInfo: PageInfo;
    }

