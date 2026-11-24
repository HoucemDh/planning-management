package com.example.hikmaproject.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hikmaproject.Models.Cde;

import org.springframework.stereotype.Repository;

@Repository
public interface CdeRepository extends JpaRepository<Cde, Long>{

    @SuppressWarnings("null")
    Page<Cde> findAll(Pageable pageable);
    Page<Cde>findByArticleContainingIgnoreCaseOrNocommandeContainingIgnoreCaseOrRaisonsocialeContainingIgnoreCase(
        String article, 
        String nocommande, 
        String raisonsociale,
        Pageable pageable);
}
