package com.example.hikmaproject.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hikmaproject.Models.CdeAchat;

@Repository
public interface CdeAchatRepository extends JpaRepository<CdeAchat, Long> {
    @SuppressWarnings("null")
    Page<CdeAchat> findAll(Pageable pageable);

    Page<CdeAchat> findByNoCommandeContainingIgnoreCaseOrArticleContainingIgnoreCaseOrDesignationContainingIgnoreCase(
        String noCommande, 
        String article, 
        String designation, 
        Pageable pageable
    );

    List<CdeAchat> findByArticleAndMoisStartingWith(String article, String prefixMois);
    List<CdeAchat> findByArticle(String article);

}
