package com.example.hikmaproject.Models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class MonthlyNeed {
    @Column(name = "month", insertable = true, updatable = true)
    private String month;
    
    @Column(name = "need_value")
    private BigDecimal value;
    
    @Column(name = "Stock_fin_mois")
    private BigDecimal stockFinMois;

    public MonthlyNeed(String month, BigDecimal value) {
        this.month = month;
        this.value = value;
    }
    
}