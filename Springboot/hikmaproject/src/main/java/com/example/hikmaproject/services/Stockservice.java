package com.example.hikmaproject.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hikmaproject.Models.Stock;
import com.example.hikmaproject.Models.StockDeliveryInfo;
import com.example.hikmaproject.Models.BomN;
import com.example.hikmaproject.Models.CdeAchat;
import com.example.hikmaproject.repositories.Stockrepository;

import jakarta.persistence.EntityNotFoundException;

import com.example.hikmaproject.repositories.BomNRepository;
import com.example.hikmaproject.repositories.CdeAchatRepository;
import com.example.hikmaproject.Models.MonthlyNeed;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class Stockservice {
    
    private final Stockrepository stockRepository;
    private final StockCalculationService stockCalculationService;
    private final BomNRepository bomNRepository;
    private final CdeAchatRepository cdeAchatRepository;
    private final ExcelExportService excelExportService;


    public Stockservice(Stockrepository stockRepository, StockCalculationService stockCalculationService,
                        BomNRepository bomNRepository, StockAIService stockAIService , CdeAchatRepository cdeAchatRepository ,ExcelExportService excelExportService) {
        this.stockRepository = stockRepository;
        this.stockCalculationService = stockCalculationService;
        this.bomNRepository = bomNRepository;
        this.cdeAchatRepository = cdeAchatRepository;
        this.excelExportService = excelExportService ;
    }
    public Page<Stock> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return (query == null || query.trim().isEmpty()) ?
                stockRepository.findAll(pageRequest) :
                stockRepository.findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCase(
                        query, query, pageRequest);
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public List<BomN> getAllBomNs() {
        return bomNRepository.findAll();
    }

    // Recherche d'un stock par sa désignation (ignore la casse)
    public Stock getStockByDesignation(String designation) {
        return stockRepository.findByDesignationIgnoreCase(designation)
                .orElse(null);
    }

    public BigDecimal calculateDispoOf(String designation) {
        Stock stock = getStockByDesignation(designation);
        return (stock == null) ? BigDecimal.ZERO : stockCalculationService.calculateDispoOf(stock);
    }

    @Transactional
    public List<Stock> updateAllBesoinMoisForYear(int year) {
        List<Stock> stocks = getAllStocks();
        List<BomN> allBomNs = getAllBomNs();
        
        stockCalculationService.updateAllMonthlyNeeds(stocks, allBomNs, year);
        
        
        // Mettre à jour les quantités livrables pour l'année
        updateAllStocksWithQuantiteUsForYear(stocks, year);
        
        
        return stockRepository.saveAll(stocks);
    }

    public void updateAllStocksWithQuantiteUsForYear(List<Stock> stocks, int year) {
        for (Stock stock : stocks) {
            updateStockWithQuantiteUsPerMonth(stock, year);
        }
    }

    public void updateStockWithQuantiteUsPerMonth(Stock stock, int year) {
      String article = stock.getArticle();
      String yearPrefix = String.valueOf(year);
  
      List<CdeAchat> commandes = cdeAchatRepository.findByArticle(article);
      Map<String, StockDeliveryInfo> moisMap = new HashMap<>();
  
      // Créer un map temporaire pour stocker les quantiteUs par mois
      Map<String, BigDecimal> quantiteUsMap = new HashMap<>();
      for (CdeAchat cde : commandes) {
          String mois = cde.getMois();
          if (mois != null && mois.endsWith(yearPrefix)) {
              BigDecimal quantiteUs = cde.getQuantiteUs() != null ? cde.getQuantiteUs() : BigDecimal.ZERO;
              quantiteUsMap.merge(mois, quantiteUs, BigDecimal::add);
          }
      }
  
      // Récupérer les valeurs stock_fin_mois des monthlyNeeds
      Map<String, BigDecimal> stockFinMoisMap = new HashMap<>();
      for (MonthlyNeed monthlyNeed : stock.getMonthlyNeeds()) {
          String monthName = monthlyNeed.getMonth();
          String moisKey = convertMonthFormat(monthName, yearPrefix);
          stockFinMoisMap.put(moisKey, monthlyNeed.getStockFinMois());
      }
  
      // Combiner les deux maps et calculer stockFinMoisInclusLiv
      for (String mois : quantiteUsMap.keySet()) {
          BigDecimal quantiteUs = quantiteUsMap.get(mois);
          BigDecimal stockFinMois = stockFinMoisMap.getOrDefault(mois, BigDecimal.ZERO);
          
          // Le constructeur avec deux paramètres va automatiquement calculer stockFinMoisInclusLiv
          StockDeliveryInfo info = new StockDeliveryInfo(quantiteUs, stockFinMois);
          moisMap.put(mois, info);
      }
  
      stock.setStockFinMoisInclusLiv(moisMap);
  }



// Méthode utilitaire pour convertir le format du mois
private String convertMonthFormat(String monthNameUpperCase, String year) {
  Map<String, String> monthMap = new HashMap<>();
  monthMap.put("JANVIER", "jan");
  monthMap.put("FÉVRIER", "feb");
  monthMap.put("MARS", "mar");
  monthMap.put("AVRIL", "apr");
  monthMap.put("MAI", "may");
  monthMap.put("JUIN", "jun");
  monthMap.put("JUILLET", "jul");
  monthMap.put("AOÛT", "aug");
  monthMap.put("SEPTEMBRE", "sep");
  monthMap.put("OCTOBRE", "oct");
  monthMap.put("NOVEMBRE", "nov");
  monthMap.put("DÉCEMBRE", "dec");
  
  String monthAbbrev = monthMap.getOrDefault(monthNameUpperCase, monthNameUpperCase.toLowerCase().substring(0, 3));
  return monthAbbrev + "-" + year;
}

    @Transactional
    public void saveAllStocks(List<Stock> stocks) {
        stockRepository.saveAll(stocks);
    }

   
    @Transactional
public Stock updateBesoinMoisForArticle(int year, String articleCode) {
    if (articleCode == null || articleCode.trim().isEmpty()) {
        throw new IllegalArgumentException("Le code de l'article ne peut pas être vide.");
    }

    // Récupérer le stock correspondant au code article
    Stock stock = stockRepository.findByArticle(articleCode)
            .orElseThrow(() -> new EntityNotFoundException("Article non trouvé: " + articleCode));

    // Récupérer tous les BomNs pour cette année
    List<BomN> allBomNs = getAllBomNs();

    // Mettre à jour les besoins mensuels pour cet article uniquement
    stockCalculationService.updateAllMonthlyNeeds(Collections.singletonList(stock), allBomNs, year);

    // Sauvegarder les modifications
    return stockRepository.save(stock);
}

public ByteArrayOutputStream exportNegativeStocksToExcel() {
    List<Stock> allStocks = stockRepository.findAll();
    List<String[]> rows = new ArrayList<>();

    // En-têtes sans ID et avec tous les autres champs
    String[] headers = {
        "Code Article", "Désignation", "Unité", "Famille",
        "Quantité A", "Quantité AC", "Somme A+AC", "Quantité Q", "Quantité QPR",
        "OF Planifié", "OF Suggéré", "Somme OF Fermé", "Somme DA", "Somme CDE",
        "Unité Stock", "NB Linge", "Q Minimum", "PMP", "Pays",
        "Leadtime", "Stock Sécurité", "Dispo OF",
        "Mois", "Stock Final Mois"
    };

    for (Stock stock : allStocks) {
        if (stock.getArticle() == null || stock.getArticle().trim().isEmpty()) {
            continue; // Ignorer si article est vide ou null
        }

        if (stock.getMonthlyNeeds() != null) {
            for (MonthlyNeed need : stock.getMonthlyNeeds()) {
                if (need.getStockFinMois() != null && need.getStockFinMois().compareTo(BigDecimal.ZERO) < 0) {
                    rows.add(new String[]{
                        stock.getArticle(),
                        stock.getDesignation(),
                        stock.getUnite(),
                        stock.getFamille(),
                        toStr(stock.getQuantiteA()),
                        toStr(stock.getQuantiteAC()),
                        toStr(stock.getSommeA_AC()),
                        toStr(stock.getQuantiteQ()),
                        toStr(stock.getQuantiteQPR()),
                        toStr(stock.getOFPlanifie()),
                        toStr(stock.getOFSuggere()),
                        toStr(stock.getSommeOFFerme()),
                        toStr(stock.getSommeDA()),
                        toStr(stock.getSommeCDE()),
                        stock.getUniteStock(),
                        toStr(stock.getNBlinge()),
                        toStr(stock.getQinimum()),
                        toStr(stock.getPMP()),
                        stock.getPays(),
                        toStr(stock.getLeadtime()),
                        toStr(stock.getStocksecurite()),
                        toStr(stock.getDispo_Of()),
                        need.getMonth(),
                        need.getStockFinMois().toPlainString()
                    });
                }
            }
        }
    }

    if (rows.isEmpty()) {
        return new ByteArrayOutputStream(); 
    }

    try {
        return excelExportService.buildWorkbook(
            rows,
            headers,
            "Stocks_Négatifs_Détaillés"
        );
    } catch (Exception e) {
        throw new RuntimeException("Erreur lors de la génération du fichier Excel : " + e.getMessage(), e);
    }
}

// Méthode utilitaire pour éviter les NPE
private String toStr(Object val) {
    return val != null ? val.toString() : "";
}
}