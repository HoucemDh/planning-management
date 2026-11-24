package com.example.hikmaproject.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.hikmaproject.Models.Ofenc;
import org.springframework.stereotype.Repository;

@Repository
public interface OfencRepository extends JpaRepository<Ofenc, Long> {
    
    @SuppressWarnings("null")
    Page<Ofenc> findAll(Pageable pageable);

    Page<Ofenc> findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCaseOrSectionContainingIgnoreCase(
        String article, 
        String designation, 
        String section, 
        Pageable pageable
    );
}
