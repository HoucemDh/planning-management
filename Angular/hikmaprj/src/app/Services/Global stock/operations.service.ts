import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { globalStockResponse } from '../../Types/globalStock.types';



const ARTICLES_FILEDS = gql `
fragment ArticlesFields on Globalstock {
          article
          designation
          categorie
          quantiteUS
          uniteStock
          quantiteActiveUS
          quantiteAllouee
          dateMVT
          lot
          sLot
          identifiant
          identifiant2
          emplacement
          statut
          lotFournisseur
          datePeremption
          dateRecontrole
          demandeAnalyse
          quantiteUC
          coefUCUS
}
`;

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private apollo: Apollo) {}

  private readonly GET_ARTICLES_Pages  = gql`
    ${ARTICLES_FILEDS}
      query getAllArticles($page: Int!, $size: Int!, $query : String) {
        getAllArticles(page: $page, size: $size, query: $query) {
          content {
              ...ArticlesFields
          }
          pageInfo {
            totalElements
            totalPages
            pageNumber
            hasNext
            hasPrevious
          }
        }
      }
    `;


    getArticlesPages(page : Number, size : Number, query : String = ""): Observable<globalStockResponse> {
        return this.apollo.watchQuery<{getAllArticles : globalStockResponse}>({
          query : this.GET_ARTICLES_Pages,
          variables : {page,size,query}
        }).valueChanges
          .pipe(
            map(result => result.data.getAllArticles)
          );
    }
  }
