package com.example.hikmaproject.Models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//req
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="MRP_Bom")
public class Bom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_bom;
    
    @Column(name="codeproduit")
    private String codeproduit;
    
    @Column(name="BOM_Alternative")
    private byte BOM_Alternative;
    
    @Column(name="Categorie_Produit")
    private String Categorie_Produit;
    
    @Column(name="libelles_PF")
    private String libellesPF;
    
    @Column(name="taillelot")
    private BigDecimal taillelot;
    
    @Column(name="article")
    private String article;
    
    @Column(name="libellesMP")
    private String libellesMP;
    
    @Column(name="Qte_besoin")
    private BigDecimal Qte_besoin;
    
    @Column(name="unite")
    private String unite;
    
    @OneToMany(mappedBy = "bom", cascade = CascadeType.ALL)
    private List<BomN> bomNs = new ArrayList<>();
}