package com.example.hikmaproject.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.hikmaproject.Models.Mvst;
import com.example.hikmaproject.repositories.MvstRepository;

@Service
public class MvstService {
    public final MvstRepository MvstRepository;

    public MvstService(MvstRepository mvstRepository) {
        MvstRepository = mvstRepository;
    }

    public Page<Mvst> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
        
        if (query == null || query.trim().isEmpty()) {
            return MvstRepository.findAll(pageRequest);
        }
        
        return MvstRepository.findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCaseOrStatutContainingIgnoreCase(
            query, 
            query, 
            query, 
            pageRequest
        );
    }
}
