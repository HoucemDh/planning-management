package com.example.hikmaproject.repositories;

import com.example.hikmaproject.Models.BomN;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BomNRepository extends JpaRepository<BomN, Long> {
    List<BomN> findByCodeproduit(String codeproduit);

    Page<BomN> findByCodeproduitContainingIgnoreCaseOrCategorieProduitContainingIgnoreCaseOrLibellesPfContainingIgnoreCaseOrArticleContainingIgnoreCaseOrLibellesMpContainingIgnoreCase(
        String codeproduit,
        String categorieProduit,
        String libellesPf,
        String article,
        String libellesMp,
        Pageable pageable
    );
    

    List<BomN> findByCodeproduitAndArticle(String codeproduit, String article);
}
