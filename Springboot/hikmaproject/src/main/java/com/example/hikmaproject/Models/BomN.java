package com.example.hikmaproject.Models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "BomN")
public class BomN {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="article")
    private String article;

    @Column(name="codeproduit")
    private String codeproduit;

    @Column(name="categorie_produit")
    private String categorieProduit;

    @Column(name="libelles_pf")
    private String libellesPf;

    @Column(name="taillelot")
    private BigDecimal taillelot;

   
    @Column(name="libelles_mp")
    private String libellesMp;

    @Column(name="qte_besoin")
    private BigDecimal qteBesoin;

    @Column(name="unite")
    private String unite;

    @Column(name="reste_lancer")
    private int resteLancer;

    @Column(name="besoin_mp_mois")
    private BigDecimal besoinMpMois;

    @ManyToOne
    @JoinColumn(name = "pdp_id", nullable = false)
    private Pdp pdp;

    @ManyToOne
    @JoinColumn(name = "bom_id", nullable = false)
    private Bom bom;

    @ElementCollection
    @CollectionTable(
        name = "bomn_reste_lancer_par_mois",
        joinColumns = @JoinColumn(name = "bomn_id")
    )
    @MapKeyColumn(name = "month_key")
    private Map<String, MonthValue> resteLancerParMoisMap = new HashMap<>();

    @ElementCollection
    @CollectionTable(
        name = "bomn_besoin_mp_par_mois",
        joinColumns = @JoinColumn(name = "bomn_id")
    )
    @MapKeyColumn(name = "month_key")
    private Map<String, MonthDecimalValue> besoinMpParMoisMap = new HashMap<>();

    @Transient
    private List<MonthValue> resteLancerParMois;

    @Transient
    private List<MonthDecimalValue> besoinMpParMois;

    public void addBesoinMpParMois(String month, BigDecimal value) {
        MonthDecimalValue monthDecimalValue = new MonthDecimalValue(
            month,
            value,
            this.pdp.getYear(),
            this.codeproduit
        );
        this.besoinMpParMoisMap.put(month, monthDecimalValue);
    }

    public void addResteLancerParMois(String month, Integer value) {
        MonthValue monthValue = new MonthValue(
            month,
            value,
            this.pdp.getYear(),
            this.codeproduit
        );
        this.resteLancerParMoisMap.put(month, monthValue);
    }

    public List<MonthValue> getResteLancerParMoisList() {
        return new ArrayList<>(resteLancerParMoisMap.values());
    }

    public List<MonthDecimalValue> getBesoinMpParMoisList() {
        return new ArrayList<>(besoinMpParMoisMap.values());
    }

    public List<MonthDecimalValue> getBesoinMpParMois() {
        return new ArrayList<>(besoinMpParMoisMap.values());
    }
    
}