package com.example.hikmaproject.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.hikmaproject.Models.CdeVente;
import com.example.hikmaproject.repositories.CdeVenteRepository;

@Service
public class CdeVenteService {
    private final CdeVenteRepository cdeVenteRepository;

    public CdeVenteService(CdeVenteRepository cdeVenteRepository) {
        this.cdeVenteRepository = cdeVenteRepository;
    }

    public Page<CdeVente> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
        
        if (query == null || query.trim().isEmpty()) {
            return cdeVenteRepository.findAll(pageRequest);
        }
        
        return cdeVenteRepository.findByNoCommandeContainingIgnoreCaseOrArticleContainingIgnoreCaseOrDesignationContainingIgnoreCase(
            query, 
            query, 
            query, 
            pageRequest
        );
    }
}
