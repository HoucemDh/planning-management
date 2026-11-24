package com.example.hikmaproject.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.hikmaproject.Models.Bom;
import com.example.hikmaproject.repositories.BOMRepository;

@Service
public class Bomservice {
    private final BOMRepository bomRepository;

    public Bomservice(BOMRepository bomRepository) {
        this.bomRepository = bomRepository;
    }

    public Page<Bom> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
        
        if (query == null || query.trim().isEmpty()) {
            return bomRepository.findAll(pageRequest);
        }
        
        return bomRepository.findByCodeproduitContainingIgnoreCaseOrArticleContainingIgnoreCaseOrLibellesPFContainingIgnoreCase(
            query, 
            query, 
            query, 
            pageRequest
        );
    }
}
