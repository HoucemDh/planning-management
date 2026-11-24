package com.example.hikmaproject.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hikmaproject.Models.Stock;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository
public interface Stockrepository extends JpaRepository<Stock, Long> {

    // Recherche paginée sur article, désignation et famille
    Page<Stock> findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCase(
        String article,
        String designation,
        Pageable pageable
    );

    Optional<Stock> findByDesignationIgnoreCase(String designation);

    Optional<Stock> findByArticle(String article);

    @Query(value = "SELECT month, need_value, stock_fin_mois FROM stock_monthly_needs WHERE stock_id = :stockId", nativeQuery = true)

    List<Object[]> findMonthlyNeedsByStockId(@Param("stockId") Long stockId);


    @Query(value = "SELECT stock_id, quantite_us, mois FROM stock_fin_mois_liv WHERE stock_id = :stockId AND mois LIKE %:year", nativeQuery = true)
    List<Object[]> findQuantiteUsByStockIdAndYear(@Param("stockId") Long stockId, @Param("year") String year); 
}
