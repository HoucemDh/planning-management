// src/app/services/mvst.service.ts
import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MvstResponse } from '../../Types/mvst.types';

const MVST_FIELDS = gql`
  fragment MvstFields on Mvst {
    article
    designation
    Date_imputation
    Quantite_US
    Unite_stock
    Quantite
    Unite
    statut
    Lot
    S_lot
    Identifiant1
    Identifiant2
    Lot_fournisseur
    Emplacement
    Type_transaction
    Tiers
    Type_piece
    Piece
    Piece_origine
    No_ligne_piece
    Date_creation
    Operateur_creation
    Date_peremption
    DLU
    Affaire
  }
`;

@Injectable({
  providedIn: 'root'
})

export class MvstService {
  private readonly GET_MVST_PAGES = gql`
    ${MVST_FIELDS}
    query getMvstPages($page: Int!, $size: Int!, $query: String) {
      getMvstPages(page: $page, size: $size, query: $query) {
        content {
          ...MvstFields
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

  getMvstPages(page: number, size: number, query: string = ''): Observable<MvstResponse> {
    return this.apollo
      .watchQuery<{ getMvstPages: MvstResponse }>({
        query: this.GET_MVST_PAGES,
        variables: { page, size, query }
      })
      .valueChanges
      .pipe(
        map(result => result.data.getMvstPages)
      );
  }
}
