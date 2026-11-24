package com.example.hikmaproject.Controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Models.Stock;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import com.example.hikmaproject.services.StockAIService;
import com.example.hikmaproject.services.Stockservice;

import jakarta.mail.MessagingException;

import com.example.hikmaproject.Models.AnalysisResult;
import com.example.hikmaproject.services.EmailService;
import com.example.hikmaproject.services.PdfService;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.io.IOException;
@Controller
public class StockController {

    private final Stockservice stockService;
    private final StockAIService stockAIService;
    private final PdfService pdfService;
    private final EmailService emailService;

    public StockController(Stockservice stockService, StockAIService stockAIService ,PdfService pdfService ,EmailService emailService) {
        this.stockService = stockService;
        this.stockAIService = stockAIService;
        this.pdfService = pdfService;
        this.emailService = emailService;

    }

    @QueryMapping
    public PagedResponse<Stock> getStockPages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<Stock> stockPage = stockService.getAllPaginated(page, size, query);
        return createPagedResponse(stockPage);
    }

    @QueryMapping
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @QueryMapping
    public BigDecimal calculateDispoOf(@Argument String designation) {
        return stockService.calculateDispoOf(designation);
    }

    @MutationMapping
    public Boolean updateAllBesoinMoisForYear(@Argument int year) {
        stockService.updateAllBesoinMoisForYear(year);
        return true;
    }
    
    @MutationMapping
    public AnalysisResult AnalysisResult(@Argument String designation) {
        return stockAIService.analyzeStockWithAI(designation);
    }
    
    @MutationMapping
    public String exportAnalysisPdf(@Argument String designation) {
        AnalysisResult result = stockAIService.analyzeStockWithAI(designation);
        byte[] pdfBytes = pdfService.generateAnalysisPdf(result);
        return Base64.getEncoder().encodeToString(pdfBytes);
    }
    
    @MutationMapping
    public Boolean shareAnalysisByEmail(@Argument String designation,
                                        @Argument String email) {
        return stockAIService.shareAnalysisByEmail(designation, email);
    }
    

@MutationMapping
    public Stock updateBesoinMoisForArticle(@Argument int year, @Argument String articleCode) {
        return stockService.updateBesoinMoisForArticle(year, articleCode);
    }

@QueryMapping
public String exportNegativeStocksExcel() {
    ByteArrayOutputStream baos = stockService.exportNegativeStocksToExcel();
    if (baos != null) {
        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }
    return null;
}

    // Méthode utilitaire pour créer une réponse paginée
    private PagedResponse<Stock> createPagedResponse(Page<Stock> page) {
        PageInfo pageInfo = new PageInfo(
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.hasNext(),
            page.hasPrevious()
        );
        return new PagedResponse<>(page.getContent(), pageInfo);
    }
}