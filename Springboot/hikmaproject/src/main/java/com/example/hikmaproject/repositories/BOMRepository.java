package com.example.hikmaproject.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hikmaproject.Models.Bom;
import java.util.List;
@Repository
public interface BOMRepository extends JpaRepository<Bom, Long> {
   // Trouver les BOMs par code produit
   List<Bom> findByCodeproduit(String codeProduit);
    
   // Recherche paginée sur plusieurs champs
   Page<Bom> findByCodeproduitContainingIgnoreCaseOrArticleContainingIgnoreCaseOrLibellesPFContainingIgnoreCase(
       String codeProduit, 
       String article, 
       String libellesPF, 
       Pageable pageable
   );
}
