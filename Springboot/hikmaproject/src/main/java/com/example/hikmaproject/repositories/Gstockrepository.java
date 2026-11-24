package com.example.hikmaproject.repositories;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hikmaproject.Models.Globalstock;
import org.springframework.stereotype.Repository;

@Repository
public interface Gstockrepository extends JpaRepository<Globalstock, Long> {

    @SuppressWarnings("null")
    Page<Globalstock>findAll(Pageable pageable);
    Page<Globalstock>findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCaseOrLotContainingIgnoreCase(
        String article
        ,String desingnation
        , String lot
        , Pageable pageable);
}
