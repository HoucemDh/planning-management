package com.example.hikmaproject.Models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "MRP_CDEAchat")
@Data
public class CdeAchat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cdeachat;

    @Column(name = "No_commande")
    private String noCommande;

    @Column(name = "Date_commande")
    private LocalDateTime dateCommande;

    @Column(name = "Date_recept_prevue")
    private LocalDateTime dateReceptPrevue;

    @Column(name = "Fournisseur")
    private String fournisseur;

    @Column(name = "Raison_sociale")
    private String raisonSociale;

    @Column(name = "Article")
    private String article;

    @Column(name = "Designation")
    private String designation;

    @Column(name = "Quantite_UA")
    private BigDecimal quantiteUa;

    @Column(name = "Quantite_US")
    private BigDecimal quantiteUs;

    @Column(name = "Unite_achat")
    private String uniteAchat;

    @Column(name = "Reste_livrer")
    private BigDecimal resteLivrer;

    @Column(name = "Devise")
    private String devise;

    @Column(name = "Prix_brut")
    private BigDecimal prixBrut;

    @Column(name = "Montant_ligne")
    private BigDecimal montantLigne;

    @Column(name = "Pays")
    private String pays;

    @Column(name = "Condition_paiement")
    private String conditionPaiement;

    @Column(name = "Ligne_soldee")
    private Byte ligneSoldee;

    @Column(name = "Solde_Reception")
    private Byte soldeReception;

    @Column(name = "Qte_Recept_UA")
    private BigDecimal qteReceptUa;

    @Column(name = "Qte_Facture_UA")
    private BigDecimal qteFactureUa;

    @Column(name = "Reste_livrer_US")
    private BigDecimal resteLivrerUs;

    @Column(name = "Mode_livraison")
    private String modeLivraison;

    @Column(name = "Type_Achat")
    private Byte typeAchat;

    @Column(name = "Piece_Origine")
    private String pieceOrigine;

    @Column(name = "Categorie")
    private String categorie;

    @Column(name = "Facturee")
    private Byte facturee;

    @Column(name = "Imprimee")
    private Byte imprimee;

    @Column(name = "Signee")
    private Byte signee;

    @Column(name = "Date_confirm_frs")
    private LocalDateTime dateConfirmFrs;

    

    @Column(name = "Date_rec_facture")
    private LocalDateTime dateRecFacture;

    @Column(name = "Date_doc_transport")
    private LocalDateTime dateDocTransport;

    @Column(name = "Date_embarquement")
    private LocalDateTime dateEmbarquement;

    @Column(name = "Date_prevue_arr_port")
    private LocalDateTime datePrevueArrPort;

    @Column(name = "Date_avis_arrivee")
    private LocalDateTime dateAvisArrivee;

    @Column(name = "Date_rec_site")
    private LocalDateTime dateRecSite;


        @Column(name = "Mois")
        private String mois;

        @Column(name = "Date_calcul")
        private LocalDateTime dateCalcul;

}