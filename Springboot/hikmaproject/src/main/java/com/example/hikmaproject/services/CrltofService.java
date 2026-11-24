package com.example.hikmaproject.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.hikmaproject.Models.Crltof;
import com.example.hikmaproject.repositories.CrltofRepository;

@Service
public class CrltofService {
    private final CrltofRepository crltofRepository;

    public CrltofService(CrltofRepository crltofRepository) {
        this.crltofRepository = crltofRepository;
    }

    public Page<Crltof> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
        
        if (query == null || query.trim().isEmpty()) {
            return crltofRepository.findAll(pageRequest);
        }
        
        return crltofRepository.findByArticleContainingIgnoreCaseOrDesignation1ContainingIgnoreCase(
            query, 
            query, 
            pageRequest
        );
    }
}
