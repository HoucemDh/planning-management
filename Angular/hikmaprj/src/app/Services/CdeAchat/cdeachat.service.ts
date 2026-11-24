import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { CdeachatResponse } from '../../Types/cdeachat.types';

const CDEACHAT_FIELDS = gql`
  fragment CdeachatFields on CdeAchat {
   noCommande
    dateCommande
    dateReceptPrevue
    fournisseur
    raisonSociale
    article
    designation
    quantiteUa
    quantiteUs
    uniteAchat
    resteLivrer
    devise
    prixBrut
    montantLigne
    pays
    conditionPaiement
    ligneSoldee
    soldeReception
    qteReceptUa
    qteFactureUa
    resteLivrerUs
    modeLivraison
    typeAchat
    pieceOrigine
    categorie
    facturee
    imprimee
    signee
    dateConfirmFrs
    dateRecFacture
    dateDocTransport
    dateEmbarquement
    datePrevueArrPort
    dateAvisArrivee
    dateRecSite
    mois          # Ajout de la colonne mois
    dateCalcul    # Ajout de la colonne dateCalcul
  }
`;

@Injectable({
  providedIn: 'root'
})

export class CdeachatService {
  private readonly GET_CDEACHAT_PAGES = gql`
    ${CDEACHAT_FIELDS}
    query getCdeAchatPages($page: Int!, $size: Int!, $query: String) {
      getCdeAchatPages(page: $page, size: $size, query: $query) {
        content {
          ...CdeachatFields
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

private readonly CALCULATE_FIELDS_FOR_ALL = gql`
mutation {
  calculateFieldsForAll
}
`;

  constructor(private apollo: Apollo) {}

  getCdeAchatPages(page: number, size: number, query: string = ''): Observable<CdeachatResponse> {
    return this.apollo
      .watchQuery<{ getCdeAchatPages: CdeachatResponse }>({
        query: this.GET_CDEACHAT_PAGES,
        variables: { page, size, query }
      })
      .valueChanges
      .pipe(
        map(result => result.data.getCdeAchatPages)
      );
  }

  calculateFieldsForAll(): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.CALCULATE_FIELDS_FOR_ALL
      })
      .pipe(map(result => result.data));
  }
}
