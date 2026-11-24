import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BomResponse } from '../../Types/bom.types';

const BOM_FIELDS = gql`
  fragment BomFields on Bom {
    codeproduit
    BOM_Alternative
    Categorie_Produit
    libellesPF
    taillelot
    article
    libellesMP
    Qte_besoin
    unite
  }
`;

@Injectable({
  providedIn: 'root'
})
export class BomService {
  private readonly GET_BOM_PAGES = gql`
    ${BOM_FIELDS}
    query getBomPages($page: Int!, $size: Int!, $query: String) {
      getBomPages(page: $page, size: $size, query: $query) {
        content {
          ...BomFields
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

  getBomPages(page: number, size: number, query: string = ''): Observable<BomResponse> {
    return this.apollo
      .watchQuery<{ getBomPages: BomResponse }>({
        query: this.GET_BOM_PAGES,
        variables: { page, size, query }
      })
      .valueChanges
      .pipe(
        map(result => result.data.getBomPages)
      );
  }
}
