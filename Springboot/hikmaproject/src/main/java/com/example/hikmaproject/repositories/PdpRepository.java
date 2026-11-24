package com.example.hikmaproject.repositories;

import com.example.hikmaproject.Models.Pdp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PdpRepository extends JpaRepository<Pdp, Long> {
    List<Pdp> findByProduit_ReferenceAndYear(String reference, int year);
    List<Pdp> findByYear(int year);
    
    Optional<Pdp> findByLibelleAndYear(String libelle, int year);
    Optional<Pdp> findByLibelleAndYearAndMois(String libelle, int year, String mois);

    @Query("SELECT p FROM Pdp p WHERE p.year = :year AND LOWER(p.mois) LIKE LOWER(CONCAT('%', :mois, '%'))")
    
    List<Pdp> findByYearAndSearchQuery(@Param("year") int year, @Param("mois") String mois);
    
    
    @Query("SELECT p FROM Pdp p WHERE p.year = :year AND " +
           "LOWER(p.produit.libelle) LIKE LOWER(CONCAT('%', :libelle, '%'))")
    List<Pdp> findByYearAndLibelle(@Param("year") int year, @Param("libelle") String libelle);
    
    
    
    @Query("SELECT p FROM Pdp p WHERE p.year = :year AND " +
    "LOWER(p.produit.reference) LIKE LOWER(CONCAT('%', :reference, '%')) AND " +
    "LOWER(p.produit.libelle) LIKE LOWER(CONCAT('%', :libelle, '%'))")

    List<Pdp> findByYearAndReferenceAndLibelle(@Param("year") int year,
                                         @Param("reference") String reference,
                                         @Param("libelle") String libelle);
}
