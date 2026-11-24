package com.example.hikmaproject.Models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public
class MonthDecimalValue {
    @Column(name = "month_name", insertable = true, updatable = true)
    private String month;
    
    @Column(name = "decimal_value")
    private BigDecimal value;
    
    @Column(name = "year")
    private Integer year;

    private String codeProduit; // Ajout pour cohérence avec MonthDecimalValue


}