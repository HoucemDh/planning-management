import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OfencResponse } from '../../Types/ofenc.types';


const OFENC_FIELDS = gql`
  fragment OfencFields on Ofenc {
    numOrdre
    statutOrdre
    dateCreation
    article
    section
    designation
    designation2
    lot
    quantiteLct
    quantiteRestante
    destinationOF
  }
`;

@Injectable({
  providedIn: 'root'
})


export class OfencService {
private readonly GET_OFENC_PAGES = gql`
    ${OFENC_FIELDS}
    query  getOfencPages($page: Int!, $size: Int!, $query: String) {
      getOfencPages(page: $page, size: $size, query: $query) {
        content {
          ...OfencFields
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

  getOfencPages(page: number, size: number, query: string = ''): Observable<OfencResponse> {
    return this.apollo
      .watchQuery<{ getOfencPages: OfencResponse }>({
        query: this.GET_OFENC_PAGES,
        variables: { page, size, query }
      })
      .valueChanges
      .pipe(
        map(result => result.data.getOfencPages)
      );
  }
}
