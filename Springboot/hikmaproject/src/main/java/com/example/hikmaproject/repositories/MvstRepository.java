package com.example.hikmaproject.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.hikmaproject.Models.Mvst;
import org.springframework.stereotype.Repository;

@Repository
public interface MvstRepository extends JpaRepository<Mvst, Long> {
    @SuppressWarnings("null")
    Page<Mvst> findAll(Pageable pageable);

    Page<Mvst> findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCaseOrStatutContainingIgnoreCase(
        String article, 
        String designation, 
        String statut, 
        Pageable pageable
    );
}
