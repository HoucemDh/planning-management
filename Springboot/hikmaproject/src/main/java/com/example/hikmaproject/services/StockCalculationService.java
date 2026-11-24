package com.example.hikmaproject.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.hikmaproject.Models.BomN;
import com.example.hikmaproject.Models.MonthDecimalValue;
import com.example.hikmaproject.Models.MonthlyNeed;
import com.example.hikmaproject.Models.Stock;
import com.example.hikmaproject.repositories.BomNRepository;
import com.example.hikmaproject.repositories.Stockrepository;

@Service
public class StockCalculationService {
    private final BomNRepository bomNRepository;
    private final Stockrepository stockrepository;
    private final EmailService emailService;
    private final ExcelExportService excelExportService;

    // Liste des mois en français (ordre d'affichage)
    private static final String[] MONTHS_FR = {
        "JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
        "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"
    };

    public StockCalculationService(BomNRepository bomNRepository, Stockrepository stockrepository, 
                                  EmailService emailService, ExcelExportService excelExportService) {
        this.bomNRepository = bomNRepository;
        this.stockrepository = stockrepository;
        this.emailService = emailService;
        this.excelExportService = excelExportService;
    }

    /**
     * Calcule la disponibilité du stock.
     * Dispo_Of = SommeA_AC + QuantiteQ – SommeOFFerme
     */
    public BigDecimal calculateDispoOf(Stock stock) {
        BigDecimal sommeAAC = Optional.ofNullable(stock.getSommeA_AC()).orElse(BigDecimal.ZERO);
        BigDecimal quantiteQ = Optional.ofNullable(stock.getQuantiteQ()).orElse(BigDecimal.ZERO);
        BigDecimal sommeOFFerme = Optional.ofNullable(stock.getSommeOFFerme()).orElse(BigDecimal.ZERO);
        return sommeAAC.add(quantiteQ).subtract(sommeOFFerme);
    }

    /**
     * Met à jour les besoins mensuels pour chaque stock pour une année donnée.
     * Les anciennes valeurs de monthlyNeeds sont supprimées puis remplacées par
     * la somme des valeurs trouvées dans les enregistrements BomN pour chaque mois.
     * Si des stocks négatifs sont détectés, une notification unique est envoyée avec pièce jointe Excel.
     */
    public void updateAllMonthlyNeeds(List<Stock> stocks, List<BomN> allBomNs, int year) {
        // Définir l'année effective
        final int effectiveYear = (year <= 0) ? LocalDate.now().getYear() : year;
        LocalDate today = LocalDate.now();
        int currentMonthIndex = today.getMonthValue() - 1;
        if (currentMonthIndex < 0 || currentMonthIndex >= MONTHS_FR.length) {
            currentMonthIndex = 0;
        }
        // Tableau des mois en majuscules pour comparaison
        List<String> allMonths = Arrays.asList(MONTHS_FR);

        // Variables pour déterminer s'il faut envoyer des notifications
        boolean hasAchat = false, hasEtudes = false;
        
        // Préparation des notifications HTML
        StringBuilder achatHtml = new StringBuilder();
        StringBuilder etudesHtml = new StringBuilder();
        
        // Listes pour stocker les données pour Excel
        List<String[]> achatRows = new ArrayList<>();
        List<String[]> etudesRows = new ArrayList<>();
    
        // Regrouper les BomN par article pour l'année effective
        Map<String, List<BomN>> bomNsByArticle = allBomNs.stream()
            .filter(bomN -> bomN.getPdp() != null && bomN.getPdp().getYear() == effectiveYear)
            .collect(Collectors.groupingBy(
                bomN -> bomN.getArticle() != null ? bomN.getArticle().trim().toUpperCase() : ""
            ));
    
        if (stocks == null) {
            return;
        }
        
        // Pour chaque stock, recalculer les besoins mensuels et la disponibilité
        for (Stock stock : stocks) {
            if (stock == null || stock.getArticle() == null) {
                continue;
            }
            
            String normalizedStockArticle = stock.getArticle().trim().toUpperCase();
            List<BomN> relevantBomNs = bomNsByArticle.getOrDefault(normalizedStockArticle, Collections.emptyList());
    
            // Réinitialiser la liste des besoins mensuels
            if (stock.getMonthlyNeeds() == null) {
                stock.setMonthlyNeeds(new ArrayList<>());
            } else {
                stock.getMonthlyNeeds().clear();
            }
    
            // Accumuler la somme des valeurs de besoin par mois pour ce stock
            Map<String, BigDecimal> needsMap = new HashMap<>();
            for (BomN bomN : relevantBomNs) {
                if (bomN.getBesoinMpParMois() == null) {
                    continue;
                }
                
                for (MonthDecimalValue mdv : bomN.getBesoinMpParMois()) {
                    if (mdv == null || mdv.getMonth() == null || mdv.getValue() == null) {
                        continue;
                    }
                    
                    String monthKey = normalizeMonth(mdv.getMonth());
                    // Additionner les valeurs de besoin pour le même mois au lieu de prendre que la première
                    needsMap.compute(monthKey, (key, existingValue) -> 
                        (existingValue == null) ? mdv.getValue() : existingValue.add(mdv.getValue())
                    );
                }
            }
    
            // Construire la liste des besoins mensuels dans l'ordre
            for (String month : allMonths) {
                BigDecimal monthlyNeed = needsMap.getOrDefault(month, BigDecimal.ZERO);
                stock.getMonthlyNeeds().add(new MonthlyNeed(month, monthlyNeed));
            }
    
            // Mettre à jour le besoin du mois courant
            if (effectiveYear == today.getYear()) {
                stock.setBesoinMoisActuelle(needsMap.getOrDefault(allMonths.get(currentMonthIndex), BigDecimal.ZERO));
            } else {
                stock.setBesoinMoisActuelle(needsMap.getOrDefault(allMonths.get(0), BigDecimal.ZERO));
            }
    
            // Calculer et mettre à jour la disponibilité (Dispo_Of)
            stock.setDispo_Of(calculateDispoOf(stock));
    
            // Calculer le stock cumulatif (Stock fin Mois Brut)
            BigDecimal cumulativeStock = stock.getDispo_Of();
            List<MonthlyNeed> monthlyNeeds = stock.getMonthlyNeeds();
            for (int i = 0; i < monthlyNeeds.size(); i++) {
                MonthlyNeed mn = monthlyNeeds.get(i);
                BigDecimal need = (mn.getValue() != null) ? mn.getValue() : BigDecimal.ZERO;
                cumulativeStock = cumulativeStock.subtract(need);
                mn.setStockFinMois(cumulativeStock);
    
                // Récupérer l'indice du mois courant de la ligne traitée
                int monthIdx = allMonths.indexOf(mn.getMonth().toUpperCase());
                if (cumulativeStock.compareTo(BigDecimal.ZERO) < 0) {
                    // Calculer le manquant et formater pour l'affichage
                    BigDecimal missing;
                    if (i < monthlyNeeds.size() - 1) {
                        MonthlyNeed nextMonth = monthlyNeeds.get(i + 1);
                        missing = cumulativeStock.subtract(nextMonth.getValue() != null ? nextMonth.getValue() : BigDecimal.ZERO);
                    } else {
                        missing = cumulativeStock;
                    }
                    
                    String formattedValue = String.format("%.2f", missing.doubleValue());
                    String formattedStock = String.format("%.2f", cumulativeStock.doubleValue());
                    
                    // Si le mois est actuel ou antérieur
                    if (monthIdx <= currentMonthIndex) {
                        hasAchat = true;
                        achatHtml.append("<tr>")
                            .append("<td>").append(stock.getArticle()).append("</td>")
                            .append("<td>").append(stock.getDesignation()).append("</td>")
                            .append("<td>").append(mn.getMonth()).append("</td>")
                            .append("<td class='negative-value'>").append(formattedValue).append("</td>")
                            .append("</tr>");
                        
                        achatRows.add(new String[]{
                            stock.getArticle(),
                            stock.getDesignation(),
                            mn.getMonth(),
                            formattedValue
                        });
                    } else {
                        // Si le mois est futur
                        hasEtudes = true;
                        etudesHtml.append("<tr>")
                            .append("<td>").append(stock.getArticle()).append("</td>")
                            .append("<td>").append(stock.getDesignation()).append("</td>")
                            .append("<td>").append(mn.getMonth()).append("</td>")
                            .append("<td class='negative-value'>").append(formattedStock).append("</td>")
                            .append("</tr>");
                        
                        etudesRows.add(new String[]{
                            stock.getArticle(),
                            stock.getDesignation(),
                            mn.getMonth(),
                            formattedStock
                        });
                    }
                }
            }
            // Mettre à jour le stock du dernier mois
            stock.setStockFinMois(cumulativeStock);
        }
    
        // Envoi des emails si des données négatives ont été détectées
        if (hasAchat) {
            String html = generateEmailTemplate(
                "Notification de manquants achat",
                "Articles en rupture pour mois actuel/précédents",
                new String[]{"Article", "Désignation", "Mois", "Manquant"},
                achatHtml.toString()
            );
            
            try {
                var baos = excelExportService.buildWorkbook(
                    achatRows,
                    new String[]{"Article", "Désignation", "Mois", "Manquant"},
                    "Manquants_Achat"
                );
                
                emailService.sendEmailWithAttachment(
                    "hammami.imen200@gmail.com",
                    "Manquants achat – " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    html,
                    baos.toByteArray(),
                    "manquants_achat_" + LocalDate.now() + ".xlsx"
                );
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        if (hasEtudes) {
            String html = generateEmailTemplate(
                "Notification stocks négatifs futurs",
                "Articles en rupture pour mois futurs",
                new String[]{"Article", "Désignation", "Mois", "Stock final"},
                etudesHtml.toString()
            );
            
            try {
                var baos = excelExportService.buildWorkbook(
                    etudesRows,
                    new String[]{"Article", "Désignation", "Mois", "Stock final"},
                    "Stocks_Futurs"
                );
                
                emailService.sendEmailWithAttachment(
                    "hammami.imen200@gmail.com",
                    "Stocks futurs – " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    html,
                    baos.toByteArray(),
                    "stocks_futurs_" + LocalDate.now() + ".xlsx"
                );
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    /**
     * Normalise le nom d'un mois en majuscules et sans espaces superflus.
     */
    private String normalizeMonth(String month) {
        return month == null ? "" : month.trim().toUpperCase();
    }
    
    /**
     * Génère un template HTML pour les emails avec un design professionnel
     */
    private String generateEmailTemplate(String title, String description, String[] headers, String tableContent) {
        StringBuilder template = new StringBuilder();
        
        // En-tête HTML avec styles CSS intégrés
        template.append("<!DOCTYPE html>")
               .append("<html>")
               .append("<head>")
               .append("<meta charset='UTF-8'>")
               .append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
               .append("<style>")
               .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }")
               .append(".container { max-width: 800px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }")
               .append(".header { background-color: #3498db; color: white; padding: 15px; border-radius: 5px 5px 0 0; margin-bottom: 20px; text-align: center; }")
               .append(".header h1 { margin: 0; font-size: 24px; }")
               .append(".content { padding: 0 15px; }")
               .append(".description { margin-bottom: 20px; color: #555; }")
               .append("table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }")
               .append("th { background-color: #3498db; color: white; font-weight: bold; text-align: left; padding: 10px; }")
               .append("td { padding: 8px; border-bottom: 1px solid #ddd; }")
               .append("tr:nth-child(even) { background-color: #f2f2f2; }")
               .append("tr:hover { background-color: #e9e9e9; }")
               .append(".negative-value { color: #e74c3c; font-weight: bold; }")
               .append(".footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }")
               .append("</style>")
               .append("</head>")
               .append("<body>")
               .append("<div class='container'>")
               .append("<div class='header'>")
               .append("<h1>").append(title).append("</h1>")
               .append("</div>")
               .append("<div class='content'>")
               .append("<p class='description'>").append(description).append("</p>")
               .append("<p>Veuillez trouver en pièce jointe le fichier Excel contenant tous les détails.</p>")
               .append("<table>")
               .append("<thead><tr>");
        
        // Ajouter les en-têtes du tableau
        for (String header : headers) {
            template.append("<th>").append(header).append("</th>");
        }
        
        template.append("</tr></thead>")
               .append("<tbody>")
               .append(tableContent)
               .append("</tbody>")
               .append("</table>")
               .append("</div>")
               .append("<div class='footer'>")
               .append("Ce message a été généré automatiquement le ").append(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
               .append(" à ").append(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
               .append(".</div>")
               .append("</div>")
               .append("</body>")
               .append("</html>");
        
        return template.toString();
    }
}