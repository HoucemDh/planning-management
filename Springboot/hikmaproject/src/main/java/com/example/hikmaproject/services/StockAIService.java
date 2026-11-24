package com.example.hikmaproject.services;

import com.example.hikmaproject.Models.AnalysisResult;
import com.example.hikmaproject.Models.MonthlyNeed;
import com.example.hikmaproject.Models.Stock;
import com.example.hikmaproject.repositories.Stockrepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.mail.MessagingException;

import org.springframework.stereotype.Service;


import java.io.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Optional;

@Service
public class StockAIService {
    private final Stockrepository stockrepository;

    private final EmailService emailService; 
    
    public StockAIService(Stockrepository stockRepository ,EmailService emailService) {
        this.stockrepository = stockRepository;
        this.emailService = emailService;
    }
    
    public AnalysisResult analyzeStockWithAI(String designation) {
        Optional<Stock> stockOpt = stockrepository.findByDesignationIgnoreCase(designation);
        
        if (stockOpt.isEmpty()) {
            return new AnalysisResult("Aucune analyse", "Produit introuvable : " + designation);
        }
        
        Stock stock = stockOpt.get();
        
BigDecimal besoinMoisActuel= stock.getQuantiteAC() != null ? stock.getQuantiteAC() : BigDecimal.ZERO;

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM_yyyy", Locale.FRENCH);
String moisActuel = YearMonth.now().format(DateTimeFormatter.ofPattern("MMMM", Locale.FRENCH)).toUpperCase();

BigDecimal quantiteDisponible= stock.getMonthlyNeeds().stream()
    .filter(mn -> mn.getMonth().equalsIgnoreCase(moisActuel))
    .map(MonthlyNeed::getStockFinMois)
    .findFirst()
    .orElse(BigDecimal.ZERO);




        // Appel à l'IA avec les attributs corrects
        JsonNode result = predictStockAction(quantiteDisponible, besoinMoisActuel);
        
        String action = result.get("action").asText();
        String analyse = result.get("analyse").asText();
        double confidence = result.has("confidence") ? result.get("confidence").asDouble() : 0.0;
        
        return new AnalysisResult(action, analyse, confidence);
    }

   public boolean shareAnalysisByEmail(String designation, String toEmail) {
    // 1) Générer l'analyse
    AnalysisResult result = analyzeStockWithAI(designation);
    Optional<Stock> stockOpt = stockrepository.findByDesignationIgnoreCase(designation);

    if (stockOpt.isEmpty()) {
        return false;
    }

    Stock stock = stockOpt.get();

    BigDecimal quantiteDisponible = stock.getQuantiteA() != null ? stock.getQuantiteA() : BigDecimal.ZERO;

    String moisActuel = YearMonth.now()
        .getMonth()
        .getDisplayName(TextStyle.FULL, Locale.FRENCH)
        + "_" + YearMonth.now().getYear();

    BigDecimal besoinMoisActuel = stock.getMonthlyNeeds().stream()
        .filter(mn -> mn.getMonth().equalsIgnoreCase(moisActuel))
        .map(MonthlyNeed::getValue)
        .findFirst()
        .orElse(BigDecimal.ZERO);

    // 2) Construire l’e-mail avec tous les détails
    String subject = "Analyse de Stock : " + designation;

    StringBuilder html = new StringBuilder();
    html.append("<!DOCTYPE html>")
        .append("<html lang=\"fr\">")
        .append("<head>")
        .append("<meta charset=\"UTF-8\">")
        .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
        .append("<style>")
        .append("body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; }")
        .append(".header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }")
        .append(".content { background-color: #f7f9fc; padding: 25px; border-radius: 0 0 5px 5px; }")
        .append(".section { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }")
        .append(".section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }")
        .append(".highlight { color: #2980b9; font-weight: bold; }")
        .append(".confidence { display: inline-block; padding: 8px 15px; background-color: #f1f1f1; border-radius: 20px; margin-top: 10px; }")
        .append(".recommendation { padding: 15px; margin-top: 10px; background-color: #e8f4fd; border-left: 4px solid #3498db; border-radius: 3px; }")
        .append(".footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; }")
        .append("</style>")
        .append("</head>")
        .append("<body>")
        .append("<div class=\"header\">")
        .append("<h1>Analyse de stock</h1>")
        .append("</div>")
        .append("<div class=\"content\">")

        // Détails du produit
        .append("<div class=\"section\">")
        .append("<h2>").append(designation).append("</h2>")
        .append("<p><span class=\"highlight\">Date de l'analyse :</span> ").append(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH))).append("</p>")
        .append("<p><span class=\"highlight\">Mois analysé :</span> ").append(moisActuel.replace("_", " ")).append("</p>")
        .append("<p><span class=\"highlight\">Quantité disponible :</span> ").append(quantiteDisponible).append("</p>")
        .append("<p><span class=\"highlight\">Besoin pour le mois :</span> ").append(besoinMoisActuel).append("</p>")
        .append("</div>")

        // Analyse de l'IA
        .append("<div class=\"section\">")
        .append("<h3>Synthèse de l'analyse</h3>")
        .append("<p>").append(result.getAnalysis()).append("</p>")
        .append("<div class=\"confidence\">Indice de confiance : ").append(String.format("%.1f%%", result.getConfidence() * 100)).append("</div>")
        .append("</div>")

        // Action recommandée
        .append("<div class=\"section\">")
        .append("<h3>Action recommandée</h3>")
        .append("<div class=\"recommendation\">")
        .append("<p>").append(result.getRecommendedAction()).append("</p>")
        .append("</div>")
        .append("</div>")

        // Footer
        .append("<div class=\"footer\">")
        .append("<p>Cette analyse est fournie à titre informatif et ne constitue pas un conseil professionnel. Vérifiez les données avant de prendre une décision opérationnelle.</p>")
        .append("</div>")

        .append("</div>")
        .append("</body>")
        .append("</html>");

    // 3) Envoyer l'e-mail
    try {
        emailService.sendEmail(toEmail, subject, html.toString());
        return true;
    } catch (MessagingException ex) {
        ex.printStackTrace();
        return false;
    }
}

    // Méthode pour appeler le script Python
    public JsonNode predictStockAction(BigDecimal quantiteDisponible, BigDecimal besoinMoisActuel) {
        try {
            // Chemin vers le script Python
            String scriptPath = "C:\\Users\\LENOVO\\Desktop\\mrpval\\Springboot\\hikmaproject\\src\\main\\python\\predict.py";
            
            // Envoi des données au script Python
            ProcessBuilder pb = new ProcessBuilder(
                "python", scriptPath,
                quantiteDisponible.toString(), besoinMoisActuel.toString()
            );
            
            pb.redirectErrorStream(true); // pour capter les erreurs aussi
            pb.directory(new File(System.getProperty("user.dir"))); // dossier racine
            
            Process process = pb.start();
            
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            );
            
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line);
            }
            
            process.waitFor();
            
            // Convertir la réponse JSON en objet Java
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(result.toString());
        } catch (Exception e) {
            e.printStackTrace();
            // En cas d'erreur, retourner un JSON simple
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode errorNode = mapper.createObjectNode();
            errorNode.put("action", "Erreur");
            errorNode.put("analyse", "Erreur dans le script Python : " + e.getMessage());
            errorNode.put("confidence", 0.0);
            return errorNode;
        }
    }
}