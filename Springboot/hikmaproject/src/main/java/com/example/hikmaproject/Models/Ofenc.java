package com.example.hikmaproject.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "MRP_OFENC")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ofenc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_ofenc;

   
    @Column(name = "Num_Ordre", length = 20, nullable = false)
    private String numOrdre;

    @Column(name = "Statut_Ordre", nullable = false)
    private Byte statutOrdre;

    @Column(name = "Date_Creation")
    private LocalDateTime dateCreation;

    @Column(name = "Article", length = 20)
    private String article;

    @Column(name = "Section", length = 15)
    private String section;

    @Column(name = "Designation", length = 45)
    private String designation;

    @Column(name = "Designation2", length = 45)
    private String designation2;

    @Column(name = "Lot", length = 15)
    private String lot;

    @Column(name = "Quantite_lct", precision = 28, scale = 13)
    private BigDecimal quantiteLct;

    @Column(name = "Quantite_restante", precision = 28, scale = 13)
    private BigDecimal quantiteRestante;

    @Column(name = "Destination_OF", length = 45)
    private String destinationOF;
}