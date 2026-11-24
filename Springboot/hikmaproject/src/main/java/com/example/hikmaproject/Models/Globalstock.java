package com.example.hikmaproject.Models;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MRP_Global_Stock")
public class Globalstock {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_globalstock;

    @Column(name = "article")
    private String article;

    @Column(name = "designation")
    private String designation;

    @Column(name = "designation2")
    private String designation2;

    @Column(name = "categorie")
    private String categorie;

    @Column(name = "quantite_us")
    private BigDecimal quantiteUS;

    @Column(name = "unite_stock")
    private String uniteStock;

    @Column(name = "quantite_active_us")
    private BigDecimal quantiteActiveUS;

    @Column(name = "quantite_allouee")
    private BigDecimal quantiteAllouee;

    @Column(name = "date_mvt")
    private LocalDateTime dateMVT;

    @Column(name = "lot")
    private String lot;

    @Column(name = "s_lot")
    private String sLot;

    @Column(name = "identifiant")
    private String identifiant;

    @Column(name = "identifiant2")
    private String identifiant2;

    @Column(name = "emplacement")
    private String emplacement;

    @Column(name = "statut")
    private String statut;

    @Column(name = "lot_fournisseur")
    private String lotFournisseur;

    @Column(name = "date_peremption")
    private LocalDateTime datePeremption;

    @Column(name = "date_recontrole")
    private LocalDateTime dateRecontrole;

    @Column(name = "demande_analyse")
    private String demandeAnalyse;

    @Column(name = "quantite_uc")
    private BigDecimal quantiteUC;

    @Column(name = "coef_uc_us")
    private BigDecimal coefUCUS;
}
