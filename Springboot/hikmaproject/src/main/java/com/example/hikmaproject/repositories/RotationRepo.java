package com.example.hikmaproject.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hikmaproject.Models.RotationMp;
import com.example.hikmaproject.Models.Stock;
import org.springframework.stereotype.Repository;

@Repository
public interface RotationRepo extends JpaRepository<RotationMp,Long>{

    @SuppressWarnings("null")
    Page<RotationMp> findAll(Pageable pageable);

    Optional<RotationMp> findByStock(Stock stock);
}
