package com.example.hikmaproject.Models;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MRP_STOCK")

public class Stock {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_stock;
    
    @Column(name="code_article")
    private String article;
    @Column(name="designation")
    private String designation;
    @Column(name="Unite")
    private String Unite;
    @Column(name="Famille")
    private String Famille;
    @Column(name="QuantiteA")
    private BigDecimal QuantiteA;
    @Column(name="QuantiteAC")
    private BigDecimal QuantiteAC;
    @Column(name="SommeA_AC")
    private BigDecimal SommeA_AC;
    @Column(name="QuantiteQ")
    private BigDecimal QuantiteQ;
    @Column(name="QuantiteQPR")
    private BigDecimal QuantiteQPR;
    @Column(name="OFPlanifie")
    private BigDecimal OFPlanifie;
    @Column(name="OFSuggere")
    private BigDecimal OFSuggere;
    @Column(name="SommeOFFerme")
    private BigDecimal SommeOFFerme;
    @Column(name="sommeDA")
    private BigDecimal sommeDA;
    @Column(name="SommeCDE")
    private BigDecimal SommeCDE;
    @Column(name="UniteStock")
    private String UniteStock;
    @Column(name="NBlinge")
    private Integer NBlinge;
    @Column(name="Qinimum")
    private BigDecimal Qinimum;
    @Column(name="PMP")
    private BigDecimal PMP;
    @Column(name="Pays")
    private String Pays;
    @Column(name="Leadtime")
    private BigDecimal Leadtime;
    @Column(name="Stocksecurite")
    private BigDecimal Stocksecurite;
   
    @Column(name="DispoOf")
    private BigDecimal Dispo_Of;


    @Column(name="besoinMoisActuelle")
    private BigDecimal besoinMoisActuelle;
   
    @Column(name="StockFinMois")
    private BigDecimal stockFinMois;
    
   
    @ElementCollection
    @CollectionTable(
        name = "stock_monthly_needs", 
        joinColumns = @JoinColumn(name = "stock_id")
    )
    private List<MonthlyNeed> monthlyNeeds = new ArrayList<>();


    @ElementCollection
    @CollectionTable(name = "stock_fin_mois_liv", joinColumns = @JoinColumn(name = "stock_id"))
    @MapKeyColumn(name = "mois")
    @Column(name = "quantite_us") // Cette annotation sera ignorée car nous utilisons un type embeddable
    private Map<String, StockDeliveryInfo> stockFinMoisInclusLiv = new HashMap<>();
    
}