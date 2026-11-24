package com.example.hikmaproject.Models;


import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuantiteUsParMois {
    private String mois;
    private BigDecimal quantiteUs;
    private BigDecimal stockFinMois;
    private BigDecimal stockFinMoisInclusLiv;
    
    public QuantiteUsParMois(String mois, BigDecimal quantiteUs, BigDecimal stockFinMois) {
        this.mois = mois;
        this.quantiteUs = quantiteUs != null ? quantiteUs : BigDecimal.ZERO;
        this.stockFinMois = stockFinMois != null ? stockFinMois : BigDecimal.ZERO;
        this.stockFinMoisInclusLiv = this.quantiteUs.add(this.stockFinMois);
    }
}