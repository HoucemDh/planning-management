package com.example.hikmaproject.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "MRP_CDEVENTE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CdeVente {



        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_cdevente;

    @Column(name = "No_Commande", length = 20, nullable = false)
    private String noCommande;

    @Column(name = "Client_Commande", length = 15, nullable = false)
    private String clientCommande;

    @Column(name = "Raison_sociale", length = 35, nullable = false)
    private String raisonSociale;

    @Column(name = "Article", length = 20, nullable = false)
    private String article;

    @Column(name = "Designation", length = 45, nullable = false)
    private String designation;

    @Column(name = "Qte_CommandeeUS", precision = 28, scale = 13, nullable = false)
    private BigDecimal qteCommandeeUS;

    @Column(name = "Qte_alloueeUS", precision = 28, scale = 13, nullable = false)
    private BigDecimal qteAlloueeUS;

    @Column(name = "Qte_livreeUS", precision = 28, scale = 13, nullable = false)
    private BigDecimal qteLivreeUS;

    @Column(name = "Qte_FactureeUS", precision = 28, scale = 13, nullable = false)
    private BigDecimal qteFactureeUS;

    @Column(name = "Qte_Restante_non_livree", precision = 29, scale = 13)
    private BigDecimal qteRestanteNonLivree;

    @Column(name = "Qte_Restante_non_Facturée", precision = 29, scale = 13)
    private BigDecimal qteRestanteNonFacturee;

    @Column(name = "Date_liv_Demandee")
    private LocalDateTime dateLivDemandee;

    @Column(name = "Date_liv_Prevue")
    private LocalDateTime dateLivPrevue;

    @Column(name = "Etat_ligne", nullable = false)
    private Byte etatLigne;

    @Column(name = "Facturee", nullable = false)
    private Byte facturee;

    @Column(name = "No_livraison", length = 20, nullable = false)
    private String noLivraison;

    @Column(name = "Statut_Ordre", nullable = false)
    private Byte statutOrdre;

    @Column(name = "Operateur_Création", length = 5, nullable = false)
    private String operateurCreation;

    @Column(name = "Prix_Brut", precision = 19, scale = 5, nullable = false)
    private BigDecimal prixBrut;

    @Column(name = "Montant_Restantnonlivre", precision = 38, scale = 7)
    private BigDecimal montantRestantNonLivre;

    @Column(name = "Montant_Restantnonfacturée", precision = 38, scale = 7)
    private BigDecimal montantRestantNonFacturee;

    @Column(name = "Prix_Net_HT", precision = 19, scale = 5, nullable = false)
    private BigDecimal prixNetHT;

    @Column(name = "Prix_Net", precision = 19, scale = 5, nullable = false)
    private BigDecimal prixNet;

    @Column(name = "Réf_commande_client", length = 30, nullable = false)
    private String refCommandeClient;

    @Column(name = "Date_commande")
    private LocalDateTime dateCommande;

    @Column(name = "Condition_paiement", length = 15, nullable = false)
    private String conditionPaiement;

    @Column(name = "Pays_Commande", length = 3, nullable = false)
    private String paysCommande;

    @Column(name = "Pays_livraison", length = 3, nullable = false)
    private String paysLivraison;

    @Column(name = "Pays_facture", length = 3, nullable = false)
    private String paysFacture;

    @Column(name = "No_facture_proforma", length = 20, nullable = false)
    private String noFactureProforma;

    @Column(name = "Facturation", precision = 20, scale = 5, nullable = false)
    private BigDecimal facturation;

    @Column(name = "Signee", nullable = false)
    private Byte signee;
}
