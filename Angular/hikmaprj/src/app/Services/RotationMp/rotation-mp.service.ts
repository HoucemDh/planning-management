import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { rotationResponse } from '../../Types/rotation.types';
import { map, Observable } from 'rxjs';

const Rotation_FIELDS = gql`
    fragment RotationFIELDS on rotationMp {
      dispoof
      article
      designation
    }
`;

@Injectable({
  providedIn: 'root'
})
export class RotationMpService {
  private readonly GET_ROTATION = gql`
    ${Rotation_FIELDS}
      query getAllRotationMp($page: Int!, $size: Int, $filterNegative: Boolean, $query: String){
        getAllRotationMp(page: $page, size: $size, filterNegative: $filterNegative, query: $query){
          content{
                ...RotationFIELDS
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

  private readonly GENERATE_ROTATION = gql`
    mutation generateRotationMp {
      generateRotationMp
    }
  `;

  constructor(private apollo: Apollo) { }

  getRotationPages(page: number, size: number, filterNegative: boolean = false, query: string = ''): Observable<rotationResponse> {
    // Normalize the query string
    const normalizedQuery = query?.trim() || '';
    
    return this.apollo.watchQuery<{getAllRotationMp: rotationResponse}>({
      query: this.GET_ROTATION,
      variables: {
        page,
        size,
        filterNegative,
        query: normalizedQuery || null // Only send null if query is empty after trimming
      },
      fetchPolicy: 'network-only'
    }).valueChanges
    .pipe(
      map(result => result.data.getAllRotationMp)
    );
  }

  generateRotation(): Observable<any> {
    return this.apollo.mutate({
      mutation: this.GENERATE_ROTATION,
      refetchQueries: [
        {
          query: this.GET_ROTATION,
          variables: { 
            page: 0, 
            size: 20,
            filterNegative: false,
            query: null
          }
        }
      ]
    });
  }
}
