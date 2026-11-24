package com.example.hikmaproject.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.hikmaproject.Models.Crltof;
import org.springframework.stereotype.Repository;

@Repository
public interface CrltofRepository extends JpaRepository<Crltof, Long> {
    @SuppressWarnings("null")
    Page<Crltof> findAll(Pageable pageable);

    Page<Crltof> findByArticleContainingIgnoreCaseOrDesignation1ContainingIgnoreCase(
        String article, 
        String designation1, 
        Pageable pageable
    );
}
