
package com.example.hikmaproject.repositories;

import com.example.hikmaproject.Models.Produit;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    Optional<Produit> findByReference(String reference);
    Optional<Produit> findByLibelle(String libelle);

}
