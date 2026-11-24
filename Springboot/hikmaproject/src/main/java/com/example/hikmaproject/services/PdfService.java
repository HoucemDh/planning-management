package com.example.hikmaproject.services;

import org.springframework.stereotype.Service;

import com.example.hikmaproject.Models.AnalysisResult;

import io.jsonwebtoken.io.IOException;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Element;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.draw.LineSeparator;

import java.awt.Color;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    // Palette de couleurs moderne
    private static final Color PRIMARY_COLOR = new Color(22, 101, 216);    // Bleu principal
    private static final Color SECONDARY_COLOR = new Color(240, 30, 50);   // Rouge accent (hikma)
    private static final Color BACKGROUND_LIGHT = new Color(247, 250, 252); // Gris très clair
    private static final Color TEXT_COLOR = new Color(50, 50, 50);         // Gris foncé pour texte
    private static final Color SUCCESS_COLOR = new Color(0, 155, 76);      // Vert pour achat
    private static final Color WARNING_COLOR = new Color(230, 126, 0);     // Orange pour neutre
    private static final Color DANGER_COLOR = new Color(216, 30, 40);      // Rouge pour vente
    
    public byte[] generateAnalysisPdf(AnalysisResult result) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            // Configuration du document A4 avec marges élégantes
            Document document = new Document(PageSize.A4, 56, 56, 72, 72);
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();
            
            // Polices personnalisées pour aspect moderne
            Font logoFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28);
            logoFont.setColor(SECONDARY_COLOR);
            
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);
            titleFont.setColor(PRIMARY_COLOR);
            
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            subtitleFont.setColor(PRIMARY_COLOR);
            
            Font bodyBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
            bodyBoldFont.setColor(TEXT_COLOR);
            
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            bodyFont.setColor(TEXT_COLOR);
            
            Font noteFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            noteFont.setColor(new Color(120, 120, 120));
            
            // EN-TÊTE DU DOCUMENT
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            try {
                headerTable.setWidths(new float[]{1, 1});
            } catch (Exception e) {
                // Ignorer
            }
            
            // Logo "hikma." en rouge
            PdfPCell logoCell = new PdfPCell();
            Paragraph logoPara = new Paragraph("hikma.", logoFont);
            logoCell.addElement(logoPara);
            logoCell.setBorder(Rectangle.NO_BORDER);
            logoCell.setPaddingBottom(10);
            headerTable.addCell(logoCell);
            
            // Date et code du rapport
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy • HH:mm");
            PdfPCell dateCell = new PdfPCell();
            Paragraph datePara = new Paragraph("Rapport #" + generateReportId() + "\n" + 
                                           dateFormat.format(new Date()), noteFont);
            datePara.setAlignment(Element.ALIGN_RIGHT);
            dateCell.addElement(datePara);
            dateCell.setBorder(Rectangle.NO_BORDER);
            dateCell.setPaddingBottom(10);
            headerTable.addCell(dateCell);
            
            document.add(headerTable);
            
            // Ligne de séparation fine
            LineSeparator separator = new LineSeparator();
            separator.setLineColor(BACKGROUND_LIGHT);
            separator.setLineWidth(2);
            document.add(separator);
            
            // Titre principal avec espacement
            document.add(new Paragraph(" "));
            Paragraph titlePara = new Paragraph("Analyse de stock par IA", titleFont);
            titlePara.setAlignment(Element.ALIGN_CENTER);
            titlePara.setSpacingAfter(20);
            document.add(titlePara);
            
            // SECTION RÉSUMÉ - Boîte d'information principale
            PdfPTable summaryTable = new PdfPTable(1);
            summaryTable.setWidthPercentage(100);
            
            // Entête de la boîte
            PdfPCell summaryHeaderCell = new PdfPCell();
            summaryHeaderCell.setBackgroundColor(PRIMARY_COLOR);
            Paragraph summaryTitle = new Paragraph("RÉSUMÉ DE L'ANALYSE", 
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE));
            summaryTitle.setAlignment(Element.ALIGN_CENTER);
            summaryHeaderCell.addElement(summaryTitle);
            summaryHeaderCell.setPadding(8);
            summaryTable.addCell(summaryHeaderCell);
            
            // Bloc de recommandation
            PdfPCell recCell = new PdfPCell();
            recCell.setBackgroundColor(BACKGROUND_LIGHT);
            recCell.setPadding(15);
            
            // Table intérieure pour le résumé
            PdfPTable innerTable = new PdfPTable(2);
            innerTable.setWidthPercentage(100);
            try {
                innerTable.setWidths(new float[]{2, 5});
            } catch (Exception e) {
                // Ignorer
            }
            
            // En-tête Recommandation
            PdfPCell recLabelCell = new PdfPCell();
            recLabelCell.addElement(new Paragraph("RECOMMANDATION", 
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, PRIMARY_COLOR)));
            recLabelCell.setBorder(Rectangle.NO_BORDER);
            innerTable.addCell(recLabelCell);
            
            // Valeur de la recommandation
            PdfPCell recValueCell = new PdfPCell();
            Font actionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            
            // Couleur selon la recommandation
            String action = result.getRecommendedAction().toUpperCase();
            if (action.contains("ACHAT") || action.contains("ACHETER")) {
                actionFont.setColor(SUCCESS_COLOR);
            } else if (action.contains("VENTE") || action.contains("VENDRE")) {
                actionFont.setColor(DANGER_COLOR);
            } else {
                actionFont.setColor(WARNING_COLOR);
            }
            
            Paragraph actionPara = new Paragraph(action, actionFont);
            recValueCell.addElement(actionPara);
            recValueCell.setBorder(Rectangle.NO_BORDER);
            innerTable.addCell(recValueCell);
            
            // En-tête Confiance
            PdfPCell confLabelCell = new PdfPCell();
            confLabelCell.addElement(new Paragraph("NIVEAU DE CONFIANCE", 
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, PRIMARY_COLOR)));
            confLabelCell.setBorder(Rectangle.NO_BORDER);
            confLabelCell.setPaddingTop(10);
            innerTable.addCell(confLabelCell);
            
            // Valeur de confiance
            PdfPCell confValueCell = new PdfPCell();
            String confidenceStr = String.valueOf(result.getConfidence());
            confValueCell.addElement(new Paragraph(confidenceStr, bodyBoldFont));
            confValueCell.setBorder(Rectangle.NO_BORDER);
            confValueCell.setPaddingTop(10);
            innerTable.addCell(confValueCell);
            
            recCell.addElement(innerTable);
            summaryTable.addCell(recCell);
            
            document.add(summaryTable);
            document.add(new Paragraph(" "));
            
            // SECTION ANALYSE DÉTAILLÉE
            Paragraph analysisTitle = new Paragraph("Analyse détaillée", subtitleFont);
            analysisTitle.setSpacingBefore(15);
            analysisTitle.setSpacingAfter(10);
            document.add(analysisTitle);
            
            // Cadre d'analyse
            PdfPTable analysisTable = new PdfPTable(1);
            analysisTable.setWidthPercentage(100);
            
            PdfPCell analysisCell = new PdfPCell();
            analysisCell.addElement(new Paragraph(result.getAnalysis(), bodyFont));
            analysisCell.setBackgroundColor(BACKGROUND_LIGHT);
            analysisCell.setPadding(15);
            analysisTable.addCell(analysisCell);
            
            document.add(analysisTable);
            
            // PIED DE PAGE avec disclaimer
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            
            LineSeparator footerSeparator = new LineSeparator();
            footerSeparator.setLineColor(BACKGROUND_LIGHT);
            footerSeparator.setLineWidth(1);
            document.add(footerSeparator);
            
            Font disclaimerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8);
            disclaimerFont.setColor(new Color(130, 130, 130));
            
            Paragraph disclaimer = new Paragraph(
                "Cette analyse est générée par intelligence artificielle et fournie à titre informatif uniquement. " +
                "Les recommandations ne constituent pas un conseil financier professionnel. " +
                "Consultez un conseiller financier qualifié avant toute décision d'investissement.", 
                disclaimerFont);
            disclaimer.setAlignment(Element.ALIGN_CENTER);
            disclaimer.setSpacingBefore(10);
            document.add(disclaimer);
            
            Paragraph copyright = new Paragraph(
                "© " + new SimpleDateFormat("yyyy").format(new Date()) + 
                " hikma. Tous droits réservés.", disclaimerFont);
            copyright.setAlignment(Element.ALIGN_CENTER);
            document.add(copyright);
            
            document.close();
            
        } catch (Exception e) {
            // Gérer l'exception
            throw new IOException("Erreur lors de la génération du PDF: " + e.getMessage());
        }
        
        return baos.toByteArray();
    }
    
    // Génère un ID unique pour le rapport
    private String generateReportId() {
        SimpleDateFormat idFormat = new SimpleDateFormat("yyyyMMddHHmm");
        return "AI" + idFormat.format(new Date());
    }
}