import { CdeResponse } from './../../Types/cde.types';
  import { map, Observable } from 'rxjs';
  import { Injectable } from '@angular/core';
  import { Apollo } from 'apollo-angular';
  import { gql } from 'apollo-angular';




  const cde_FILEDS = gql`
    fragment CdeFields on Cde {
              nocommande
              Date_commande
              Date_recept_prevue
              Fournisseur
              raisonsociale
              article
              Designation
              Quantite_UA 
              Quantite_US 
              Unite_achat
              Reste_livrer 
              Devise
              Prix_brut 
              Montant_ligne 
              Pays
              Condition_paiement
              Ligne_soldee
              Solde_Reception
              Qte_Recept_UA
              Qte_Facture_UA 
              Reste_livrer_US 
              Mode_livraison
              Type_Achat
              Piece_Origine
              Categorie
              Facturee
              Imprimee
              Signee
              Date_confirm_frs
              Date_rec_facture
              Date_doc_transport
              Date_embarquement
              Date_prevue_arr_port
              Date_avis_arrivee
              Date_rec_site
        }
      `;


  @Injectable({
    providedIn: 'root'
  })
  export class CdeService {

    constructor( private apollo: Apollo) { }

      private readonly getAllCdePages=gql`
      ${cde_FILEDS}
        query getAllCde($page : Int!, $size : Int!, $query : String){
          getAllCde(page : $page, size:$size, query: $query){
             content{
              ...CdeFields
             }
            pageInfo{
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
     
     
  getAllCde(page : Number, size : Number, query : String = ''): Observable<CdeResponse>{
          return this.apollo.watchQuery<{getAllCde : CdeResponse}>({
            query : this.getAllCdePages,
            variables : {page,size,query}
          }).valueChanges
          .pipe(
            map(result => result.data.getAllCde)
          );
      }
    }

