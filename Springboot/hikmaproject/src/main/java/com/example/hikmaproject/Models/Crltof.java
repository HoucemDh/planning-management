package com.example.hikmaproject.Models;
    import jakarta.persistence.*;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import java.math.BigDecimal;
    import java.time.LocalDateTime;
    
    @Entity
    @Table(name = "MRP_CRLTOF")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    
public class Crltof {
    
    
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_Crltof;

        
        @Column(name = "No_ordre", length = 20, nullable = false)
        private String noOrdre;
    
        @Column(name = "Article", length = 20, nullable = false)
        private String article;
    
        @Column(name = "Destination_OF", length = 45, nullable = false)
        private String destinationOF;
    
        @Column(name = "Lot", length = 15, nullable = false)
        private String lot;
    
        @Column(name = "Statut_ordre", nullable = false)
        private Byte statutOrdre;
    
        @Column(name = "Date_creation", nullable = false)
        private LocalDateTime dateCreation;
    
        @Column(name = "Quantite_prevue", precision = 28, scale = 13, nullable = false)
        private BigDecimal quantitePrevue;
    
        @Column(name = "Date_debut", nullable = false)
        private LocalDateTime dateDebut;
    
        @Column(name = "Date_fin", nullable = false)
        private LocalDateTime dateFin;
    
        @Column(name = "Qte_realisee_tot", precision = 28, scale = 13, nullable = false)
        private BigDecimal qteRealiseeTot;
    
        @Column(name = "Qte_realisee_CQ", precision = 28, scale = 13, nullable = false)
        private BigDecimal qteRealiseeCQ;
    
        @Column(name = "Quantite_restante", precision = 28, scale = 13, nullable = false)
        private BigDecimal quantiteRestante;
    
        @Column(name = "Qte_realisee_rejetee", precision = 28, scale = 13, nullable = false)
        private BigDecimal qteRealiseeRejetee;
    
        @Column(name = "ArticlePF", length = 20, nullable = false)
        private String articlePF;
    
        @Column(name = "Statut_matière", nullable = false)
        private Byte statutMatiere;
    
        @Column(name = "Designation1", length = 45, nullable = false)
        private String designation1;
    
        @Column(name = "Designation2", length = 45, nullable = false)
        private String designation2;
    
        @Column(name = "Quantite_besoin", precision = 28, scale = 13, nullable = false)
        private BigDecimal quantiteBesoin;
    
        @Column(name = "Quantite_allouee", precision = 28, scale = 13, nullable = false)
        private BigDecimal quantiteAllouee;
    
        @Column(name = "Quantite_consomme", precision = 28, scale = 13, nullable = false)
        private BigDecimal quantiteConsommee;
    
        @Column(name = "Ecart_Qtebesoin_et_Qteconsommee", precision = 29, scale = 13)
        private BigDecimal ecartQteBesoinEtQteConsommee;
    
        @Column(name = "Statut_allocation1", nullable = false)
        private Byte statutAllocation1;
    
        @Column(name = "Date_premier_suivi", nullable = false)
        private LocalDateTime datePremierSuivi;
    
        @Column(name = "Date_dernier_suivi", nullable = false)
        private LocalDateTime dateDernierSuivi;
    
        @Column(name = "Statut_allocation", nullable = false)
        private Byte statutAllocation;
    }
    