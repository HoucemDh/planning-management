import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { CrltofResponse } from '../../Types/crltof.types';

const CRLTOF_FIELDS = gql`
  fragment CrltofFields on Crltof {
    noOrdre 
    article 
    destinationOF 
    lot 
    statutOrdre 
    dateCreation 
    quantitePrevue 
    dateDebut 
    dateFin 
    qteRealiseeTot 
    qteRealiseeCQ 
    quantiteRestante 
    qteRealiseeRejetee 
    articlePF 
    statutMatiere 
    designation1 
    designation2 
    quantiteBesoin 
    quantiteAllouee 
    quantiteConsommee 
    ecartQteBesoinEtQteConsommee 
    statutAllocation1 
    datePremierSuivi 
    dateDernierSuivi 
    statutAllocation 
  }
`;

@Injectable({
  providedIn: 'root'
})

export class CrltofService {
  private readonly GET_CRLTOF_PAGES = gql`
    ${CRLTOF_FIELDS}
    query getCrltofPages($page: Int!, $size: Int!, $query: String) {
      getCrltofPages(page: $page, size: $size, query: $query) {
        content {
          ...CrltofFields
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

  constructor(private apollo: Apollo) {}

  getCrltofPages(page: number, size: number, query: string = ''): Observable<CrltofResponse> {
    return this.apollo
      .watchQuery<{ getCrltofPages: CrltofResponse }>({
        query: this.GET_CRLTOF_PAGES,
        variables: { page, size, query }
      })
      .valueChanges
      .pipe(
        map(result => result.data.getCrltofPages)
      );
  }
}
