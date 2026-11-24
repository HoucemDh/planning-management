package com.example.hikmaproject.Models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthValue {
    private String month;
    private Integer value;
    private Integer year;
    private String codeProduit; // Ajout pour cohérence avec MonthDecimalValue
}