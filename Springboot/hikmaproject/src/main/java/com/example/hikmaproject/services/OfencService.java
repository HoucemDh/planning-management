package com.example.hikmaproject.services;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.hikmaproject.repositories.OfencRepository;
import com.example.hikmaproject.Models.Ofenc;

@Service
public class OfencService {
    
    private final OfencRepository ofencRepository;

    public OfencService(OfencRepository ofencRepository) {
        this.ofencRepository = ofencRepository;
    }

    public Page<Ofenc> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
        
        if (query == null || query.trim().isEmpty()) {
            return ofencRepository.findAll(pageRequest);
        }
        
        return ofencRepository.findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCaseOrSectionContainingIgnoreCase(
            query, 
            query, 
            query, 
            pageRequest
        );
    }
}
