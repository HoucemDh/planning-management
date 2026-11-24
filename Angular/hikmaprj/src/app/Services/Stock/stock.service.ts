import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stock, StockResponse } from '../../Types/stock.types';

const STOCK_FIELDS = gql`
  fragment StockFields on Stock {
    article
    designation
    Unite
    Famille
    QuantiteA
    QuantiteAC
    SommeA_AC
    QuantiteQ
    QuantiteQPR
    OFPlanifie
    OFSuggere
    SommeOFFerme
    sommeDA
    SommeCDE
    UniteStock
    NBlinge
    Qinimum
    PMP
    Pays
    Leadtime
    Stocksecurite
    Dispo_Of
    besoin_actuelle
    stockFinMois
    monthlyNeeds {
      month
      value
      stockFinMois
    }
    stockFinMoisInclusLiv {      # ← ajouté
      mois
      quantiteUs
      stockFinMoisInclusLiv
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly GET_STOCK_PAGES = gql`
    ${STOCK_FIELDS}
    query getStockPages($page: Int!, $size: Int!, $query: String) {
      getStockPages(page: $page, size: $size, query: $query) {
        content {
          ...StockFields
        }
        pageInfo {
          pageNumber
          pageSize
          totalElements
          totalPages
          hasNext
          hasPrevious
        }
      }
    }
  `;

  // Correction : le nom de la mutation doit correspondre à celui exposé par le backend
  private readonly UPDATE_BESOIN_MOIS_ANNEE = gql`
    mutation updateAllBesoinMoisForYear($year: Int!) {
      updateAllBesoinMoisForYear(year: $year)
    }
  `;

  private readonly UPDATE_STOCK_FOR_YEAR_MONTH = gql`
    mutation updateAllStockValuesForYearAndMonth($year: Int!, $month: String!) {
      updateAllStockValuesForYearAndMonth(year: $year, month: $month)
    }
  `;

private readonly UPDATE_BESOIN_MOIS_FOR_ARTICLE = gql`
mutation updateBesoinMoisForArticle($year: Int!, $articleCode: String!) {
  updateBesoinMoisForArticle(year: $year, articleCode: $articleCode) {
    article
    designation

  }
}
`;

private readonly EXPORT_NEGATIVE_STOCKS_EXCEL = gql`
  query exportNegativeStocksExcel {
    exportNegativeStocksExcel

  }
`;

  constructor(private apollo: Apollo) {}

  getStockPages(page: number, size: number, query: string = ''): Observable<StockResponse> {
    return this.apollo
      .watchQuery<{ getStockPages: StockResponse }>({
        query: this.GET_STOCK_PAGES,
        variables: { page, size, query }
      })
      .valueChanges
      .pipe(map(result => result.data.getStockPages));
  }

  updateAllBesoinMoisForYear(year: number): Observable<boolean> {
    return this.apollo.mutate<{ updateAllBesoinMoisForYear: boolean }>({
      mutation: this.UPDATE_BESOIN_MOIS_ANNEE,
      variables: { year }
    }).pipe(map(result => result.data?.updateAllBesoinMoisForYear ?? false));
  }

  updateAllStockValuesForYearAndMonth(year: number, month: string): Observable<boolean> {
    return this.apollo.mutate<{ updateAllStockValuesForYearAndMonth: boolean }>({
      mutation: this.UPDATE_STOCK_FOR_YEAR_MONTH,
      variables: { year, month }
    }).pipe(map(result => result.data?.updateAllStockValuesForYearAndMonth ?? false));
  }

  updateBesoinMoisForArticle(year: number, articleCode: string): Observable<Stock> {
    return this.apollo.mutate<{ updateBesoinMoisForArticle: Stock }>({
      mutation: this.UPDATE_BESOIN_MOIS_FOR_ARTICLE,
      variables: { year, articleCode }
    }).pipe(map(result => result.data?.updateBesoinMoisForArticle as Stock));
  }

  exportNegativeStocksExcel(): Observable<string> {
  return this.apollo.mutate<{ exportNegativeStocksExcel: string }>({
    mutation: this.EXPORT_NEGATIVE_STOCKS_EXCEL
  }).pipe(
    map(result => result.data?.exportNegativeStocksExcel ?? '')
  );
}

}
