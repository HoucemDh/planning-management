package com.example.hikmaproject.Models;

import java.math.BigDecimal;
import java.io.Serializable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockDeliveryInfo implements Serializable {
    private BigDecimal quantiteUs;
    private BigDecimal stockFinMois;
    
    @Column(name = "stock_fin_mois_inclus_liv")
    private BigDecimal stockFinMoisInclusLiv;
    
    // Constructeur pour les deux premiers champs, qui calcule automatiquement le troisième
    public StockDeliveryInfo(BigDecimal quantiteUs, BigDecimal stockFinMois) {
        this.quantiteUs = quantiteUs != null ? quantiteUs : BigDecimal.ZERO;
        this.stockFinMois = stockFinMois != null ? stockFinMois : BigDecimal.ZERO;
        this.stockFinMoisInclusLiv = this.quantiteUs.add(this.stockFinMois);
    }
}