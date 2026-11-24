package com.example.hikmaproject.Models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pdp")
public class Pdp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String ref;
    private String libelle;
   
    @Column(name = "taille_lot")  
    private Integer tailleLot;
    
    private String mois;
    private int prevueLancer;
    private int lancerActuelle;
    private int resteLancer;
    private int year;
    
    @ManyToOne
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;
    
    @OneToMany(mappedBy = "pdp", cascade = CascadeType.ALL)
    private List<BomN> bomNs = new ArrayList<>();
}