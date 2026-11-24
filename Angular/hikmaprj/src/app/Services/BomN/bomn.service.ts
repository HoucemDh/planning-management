import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BomN, PagedResponseBomN } from '../../Types/bomn.types';

const BOMN_FIELDS = gql`
  fragment BomNFields on BomN {
    id
    codeproduit
    categorieProduit
    libellesPf
    taillelot
    article
    libellesMp
    qteBesoin
    unite
    resteLancer
    besoinMpMois
    resteLancerParMois {
      month
      value
      year
      codeProduit
    }
    besoinMpParMois {
      month
      value
      year
      codeProduit
    }
    pdp {
      id
      ref
      libelle
      mois
      prevueLancer
      lancerActuelle
      resteLancer
      tailleLot
      year
      produit {
        id
        libelle
        reference
        tailleLot
      }
    }
    bom {
      id_bom
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
  }
`;

@Injectable({
  providedIn: 'root'
})
export class BomNService {
  // Mutation qui génère ou met à jour les données pour une année donnée
  private readonly GENERATE_BOMN = gql`
    ${BOMN_FIELDS}
    mutation generateBomN($year: Int!) {
      generateBomN(year: $year) {
        ...BomNFields
      }
    }
  `;

  private readonly GET_BOMN_PAGES = gql`
    ${BOMN_FIELDS}
    query getBomNPages($page: Int!, $size: Int!, $query: String) {
      getBomNPages(page: $page, size: $size, query: $query) {
        content {
          ...BomNFields
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

  private readonly GET_BOMN_BY_ID = gql`
    ${BOMN_FIELDS}
    query getBomNById($id: ID!) {
      getBomNById(id: $id) {
        ...BomNFields
      }
    }
  `;

  private readonly GET_ALL_BOMN = gql`
    ${BOMN_FIELDS}
    query getAllBomN {
      getAllBomN {
        ...BomNFields
      }
    }
  `;

  private readonly GET_RESTE_LANCER_PAR_MOIS = gql`
    ${BOMN_FIELDS}
    query getResteLancerParMois($year: Int!) {
      recupererResteLancerParMois(year: $year) {
        ...BomNFields
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  // Méthode pour déclencher la mutation generateBomN
  generateBomN(year: number): Observable<BomN[]> {
    console.log("Année envoyée pour génération des données:", year);
    return this.apollo
      .mutate<{ generateBomN: BomN[] }>({
        mutation: this.GENERATE_BOMN,
        variables: { year }
      })
      .pipe(
        map(result => {
          console.log("Données générées:", result.data?.generateBomN);
          return result.data?.generateBomN || [];
        })
      );
  }

  recupererResteLancerParMois(year: number): Observable<BomN[]> {
    console.log("Année envoyée pour récupération:", year);
    return this.apollo
      .watchQuery<{ recupererResteLancerParMois: BomN[] }>({
        query: this.GET_RESTE_LANCER_PAR_MOIS,
        variables: { year },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(
        map(result => {
          console.log("Données récupérées:", result.data.recupererResteLancerParMois);
          return result.data.recupererResteLancerParMois || [];
        })
      );
  }

  getAllBomNWithResteLancer(year: number): Observable<BomN[]> {
    return this.recupererResteLancerParMois(year);
  }

  getBomNPages(page: number, size: number, query: string = ''): Observable<PagedResponseBomN> {
    return this.apollo
      .watchQuery<{ getBomNPages: PagedResponseBomN }>({
        query: this.GET_BOMN_PAGES,
        variables: { page, size, query }
      })
      .valueChanges.pipe(
        map(result => result.data.getBomNPages)
      );
  }

  getBomNById(id: string): Observable<BomN> {
    return this.apollo
      .watchQuery<{ getBomNById: BomN }>({
        query: this.GET_BOMN_BY_ID,
        variables: { id }
      })
      .valueChanges.pipe(
        map(result => result.data.getBomNById)
      );
  }

  getAllBomN(): Observable<BomN[]> {
    return this.apollo
      .watchQuery<{ getAllBomN: BomN[] }>({
        query: this.GET_ALL_BOMN
      })
      .valueChanges.pipe(
        map(result => result.data.getAllBomN)
      );
  }
}
