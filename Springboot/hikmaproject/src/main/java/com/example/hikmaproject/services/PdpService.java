package com.example.hikmaproject.services;

import com.example.hikmaproject.Models.Pdp;
import com.example.hikmaproject.Models.Produit;
import com.example.hikmaproject.repositories.PdpRepository;
import com.example.hikmaproject.repositories.ProduitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdpService {
    private final PdpRepository pdpRepository;
    private final ProduitRepository produitRepository;

    public PdpService(PdpRepository pdpRepository, ProduitRepository produitRepository) {
        this.pdpRepository = pdpRepository;
        this.produitRepository = produitRepository;
    }

    public Pdp addPlan(String libelle, String mois, int prevueLancer, int lancerActuelle, int tailleLot, int year) {
        Produit produit = produitRepository.findByLibelle(libelle)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec le libellé : " + libelle));

        // Vérifier si la tailleLot correspond
        if (produit.getTailleLot() != tailleLot) {
            throw new RuntimeException("La taille du lot ne correspond pas à celle définie pour le produit");
        }

        Pdp plan = new Pdp();
        plan.setMois(mois);
        plan.setPrevueLancer(prevueLancer);
        plan.setLancerActuelle(lancerActuelle);
        plan.setResteLancer(prevueLancer - lancerActuelle);
        plan.setYear(year);
        plan.setProduit(produit);

        plan.setRef(produit.getReference());  
        plan.setLibelle(produit.getLibelle()); 
        plan.setTailleLot(produit.getTailleLot());

        return pdpRepository.save(plan);
    }

    public List<Pdp> getAllPlans() {
        return pdpRepository.findAll();
    }

    public List<Pdp> getPlansByYear(int year) {
        return pdpRepository.findByYear(year);
    }

    public List<String> getLibelles() {
        return produitRepository.findAll().stream()
            .map(Produit::getLibelle)
            .collect(Collectors.toList());
    }

    public Produit getProductByLibelle(String libelle) {
        return produitRepository.findByLibelle(libelle)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec le libellé : " + libelle));
    }

    public List<Pdp> searchPlans(int year, String libelle) {
        return pdpRepository.findByYearAndLibelle(year, libelle);
    }

    public Pdp findPlanByLibelleYearAndMonth(String libelle, int year, String mois) {
        return pdpRepository.findByLibelleAndYearAndMois(libelle, year, mois)
            .orElseThrow(() -> new RuntimeException(
                "Plan non trouvé avec le libellé : " + libelle + ", l'année : " + year + ", et le mois : " + mois));
    }

    public Pdp updatePlanByLibelle(String libelle, int year, String mois, int prevueLancer, int lancerActuelle) {
        Pdp plan = pdpRepository.findByLibelleAndYearAndMois(libelle, year, mois)
            .orElseThrow(() -> new RuntimeException(
                "Plan non trouvé avec le libellé : " + libelle + ", l'année : " + year + ", et le mois : " + mois));
    
        plan.setPrevueLancer(prevueLancer);
        plan.setLancerActuelle(lancerActuelle);
        plan.setResteLancer(prevueLancer - lancerActuelle);
    
        return pdpRepository.save(plan);
    }
}