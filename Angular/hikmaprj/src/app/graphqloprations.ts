import { gql } from "apollo-angular";

const getAllArticles = gql`
   query getAllArticles {
       getAllArticles {
 		  article
        Designation
        Categorie
        Quantite_US
        Unite_stock
        Quantite_active_US
        Quantite_Allouee
        Lot
        S_lot
        Identifiant
        Identifiant2
        Emplacement
        statut
        Lot_fournisseur
        Date_Peremption
        Date_recontrole
        Demande_analyse
        Quantite_UC
        Coef_UC_US
    }
   }
`;
const getArt = gql`
   query getArt($article: string!) {
       getArt(article: $article) {
 		  article
        Designation
        Categorie
        Quantite_US
        Unite_stock
        Quantite_active_US
        Quantite_Allouee
        Lot
        S_lot
        Identifiant
        Identifiant2
        Emplacement
        statut
        Lot_fournisseur
        Date_Peremption
        Date_recontrole
        Demande_analyse
        Quantite_UC
        Coef_UC_US
    }
   }
`;
export {getAllArticles, getArt};