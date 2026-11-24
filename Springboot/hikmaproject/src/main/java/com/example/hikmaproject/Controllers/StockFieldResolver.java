package com.example.hikmaproject.Controllers;


import com.example.hikmaproject.Models.QuantiteUsParMois;
import com.example.hikmaproject.Models.Stock;
import com.example.hikmaproject.Models.StockDeliveryInfo;

import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class StockFieldResolver {

    @SchemaMapping(typeName = "Stock", field = "stockFinMoisInclusLiv")
    public List<QuantiteUsParMois> resolveStockFinMoisInclusLiv(Stock stock) {
        Map<String, StockDeliveryInfo> map = stock.getStockFinMoisInclusLiv();
        return map.entrySet().stream()
                .map(entry -> {
                    StockDeliveryInfo info = entry.getValue();
                    return new QuantiteUsParMois(
                        entry.getKey(), 
                        info.getQuantiteUs(),
                        info.getStockFinMois(),
                        info.getStockFinMoisInclusLiv()
                    );
                })
                .collect(Collectors.toList());
    }
}