package com.example.hikmaproject.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.hikmaproject.Models.Cde;
import com.example.hikmaproject.repositories.CdeRepository;

@Service
public class Cdeservice {
    @Autowired
    private CdeRepository cdeRepository;
    
    public Page<Cde> getAllCommandes(int page, int size, String query){
        PageRequest pageRequest = PageRequest.of(page, size);

        if(query == null || query.trim().isEmpty())
            {
                cdeRepository.findAll(pageRequest);
            }
        return cdeRepository.findByArticleContainingIgnoreCaseOrNocommandeContainingIgnoreCaseOrRaisonsocialeContainingIgnoreCase(query, query, query, pageRequest);
    }
    



}