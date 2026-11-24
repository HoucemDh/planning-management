package com.example.hikmaproject.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.hikmaproject.Models.CdeVente;
import org.springframework.stereotype.Repository;

@Repository
public interface CdeVenteRepository extends JpaRepository<CdeVente, Long> {
    @SuppressWarnings("null")
    Page<CdeVente> findAll(Pageable pageable);

    Page<CdeVente> findByNoCommandeContainingIgnoreCaseOrArticleContainingIgnoreCaseOrDesignationContainingIgnoreCase(
        String noCommande, 
        String article, 
        String designation, 
        Pageable pageable
    );
}
