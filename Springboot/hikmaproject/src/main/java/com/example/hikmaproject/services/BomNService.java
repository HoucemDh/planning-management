package com.example.hikmaproject.services;

import com.example.hikmaproject.Models.Bom;
import com.example.hikmaproject.Models.BomN;
import com.example.hikmaproject.Models.Pdp;
import com.example.hikmaproject.repositories.BomNRepository;
import com.example.hikmaproject.repositories.BOMRepository;
import com.example.hikmaproject.repositories.PdpRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class BomNService {
    private final BomNRepository bomNRepository;
    private final BOMRepository bomRepository;
    private final PdpRepository pdpRepository;

    public BomNService(BomNRepository bomNRepository, BOMRepository bomRepository, PdpRepository pdpRepository) {
        this.bomNRepository = bomNRepository;
        this.bomRepository = bomRepository;
        this.pdpRepository = pdpRepository;
    }

    /**
     * Génère les enregistrements BomN pour tous les mois de l'année donnée.
     * La génération se fait par produit (identifié par sa référence) et par BOM associée.
     *
     * @param year l'année pour laquelle générer les enregistrements BomN
     * @return la liste des enregistrements BomN créés ou mis à jour
     */


     //@CacheEvict(value = "bomNCache", key = "#year")
    public List<BomN> generateBomN(int year) {

        // Récupérer tous les PDP pour l'année indiquée
        List<Pdp> pdps = pdpRepository.findByYear(year);
        if (pdps == null || pdps.isEmpty()) {
            return Collections.emptyList();
        }

        // Regrouper les PDP par référence de produit
        Map<String, List<Pdp>> pdpsByReference = pdps.stream()
                .collect(Collectors.groupingBy(pdp -> pdp.getProduit().getReference()));

        List<BomN> resultList = new ArrayList<>();

        // Pour chaque référence produit
        for (Map.Entry<String, List<Pdp>> entry : pdpsByReference.entrySet()) {
            String reference = entry.getKey();
            List<Pdp> pdpsForRef = entry.getValue();

            // Récupérer les BOM correspondant à la référence
            List<Bom> matchingBoms = bomRepository.findByCodeproduit(reference);
            if (matchingBoms == null || matchingBoms.isEmpty()) {
                continue;
            }

            for (Bom bom : matchingBoms) {
                // Vérifier si un enregistrement BomN existe déjà pour ce produit et cet article
                List<BomN> existingBomNs = bomNRepository.findByCodeproduitAndArticle(bom.getCodeproduit(), bom.getArticle());
                BomN bomN;
                if (existingBomNs == null || existingBomNs.isEmpty()) {
                    // Création d'un nouvel enregistrement BomN
                    bomN = new BomN();
                    bomN.setCodeproduit(bom.getCodeproduit());
                    bomN.setCategorieProduit(bom.getCategorie_Produit());
                    bomN.setLibellesPf(bom.getLibellesPF());
                    bomN.setLibellesMp(bom.getLibellesMP());
                    bomN.setTaillelot(bom.getTaillelot());
                    bomN.setArticle(bom.getArticle());
                    bomN.setQteBesoin(bom.getQte_besoin());
                    bomN.setUnite(bom.getUnite());
                    bomN.setBom(bom);
                    // On affecte le premier PDP de la liste (les PDP doivent contenir le mois dans leur attribut)
                    bomN.setPdp(pdpsForRef.get(0));
                } else {
                    // Sinon, on récupère l'enregistrement existant et on supprime les données mensuelles pour l'année donnée
                    bomN = existingBomNs.get(0);
                    bomN.getResteLancerParMoisMap().entrySet().removeIf(mapEntry -> mapEntry.getValue().getYear() == year);
                    bomN.getBesoinMpParMoisMap().entrySet().removeIf(mapEntry -> mapEntry.getValue().getYear() == year);
                }

                // Pour chaque PDP de ce produit (de l'année donnée), on ajoute les données mensuelles
                for (Pdp pdp : pdpsForRef) {
                    if (pdp.getYear() != year) {
                        continue;
                    }
                    // Ajoutez un log pour afficher la valeur du mois
                    System.out.println("PDP mois: " + pdp.getMois());
                
                    String mois = pdp.getMois(); // par exemple "Jan" ou "Janvier"
                    bomN.addResteLancerParMois(mois, pdp.getResteLancer());
                    if (bomN.getQteBesoin() != null) {
                        BigDecimal resteLancerBD = BigDecimal.valueOf(pdp.getResteLancer());
                        BigDecimal besoinMpValue = bomN.getQteBesoin().multiply(resteLancerBD);
                        bomN.addBesoinMpParMois(mois, besoinMpValue);
                    }
                }
                

                // Mise à jour des champs globaux à partir des données mensuelles
                int lastResteLancer = 0;
                List<String> allMonths = Arrays.asList("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Sept", "Oct", "Nov", "Déc");
                // Recherche du dernier mois non nul (en parcourant dans l'ordre inverse)
                for (int i = allMonths.size() - 1; i >= 0; i--) {
                    String month = allMonths.get(i);
                    if (bomN.getResteLancerParMoisMap().containsKey(month)) {
                        int value = bomN.getResteLancerParMoisMap().get(month).getValue(); // méthode supposée existante dans MonthValue
                        if (value > 0) {
                            lastResteLancer = value;
                            break;
                        }
                    }
                }
                bomN.setResteLancer(lastResteLancer);
                if (bomN.getQteBesoin() != null) {
                    bomN.setBesoinMpMois(bomN.getQteBesoin().multiply(BigDecimal.valueOf(lastResteLancer)));
                }

                resultList.add(bomN);
            }
        }

        // Persistance de tous les enregistrements BomN générés ou mis à jour
        if (!resultList.isEmpty()) {
            bomNRepository.saveAll(resultList);
        }
        return resultList;
    }
/* 
    @Cacheable(value = "bomNCache", key = "#year")
    public List<BomN> getBomNFromCache(int year) {
        return generateBomN(year); // alimenter à la volée si non présent
    }
   */ 


    /**
     * Récupère et met à jour les données mensuelles (reste à lancer et besoin MP) pour chaque BomN
     * de l'année indiquée.
     *
     * @param year l'année de mise à jour
     * @return la liste des enregistrements BomN mis à jour
     */
    public List<BomN> recupererResteLancerParMois(int year) {
        List<Pdp> pdps = pdpRepository.findByYear(year);
        if (pdps == null || pdps.isEmpty()) {
            return Collections.emptyList();
        }

        // Récupérer les références produits distinctes
        Set<String> productReferences = pdps.stream()
                .map(pdp -> pdp.getProduit().getReference())
                .collect(Collectors.toSet());

        List<BomN> resultList = new ArrayList<>();

        for (String reference : productReferences) {
            List<Bom> matchingBoms = bomRepository.findByCodeproduit(reference);
            if (matchingBoms == null || matchingBoms.isEmpty()) {
                continue;
            }
            for (Bom bom : matchingBoms) {
                List<BomN> existingBomNs = bomNRepository.findByCodeproduitAndArticle(bom.getCodeproduit(), bom.getArticle());
                BomN bomNToUpdate;
                if (existingBomNs == null || existingBomNs.isEmpty()) {
                    bomNToUpdate = new BomN();
                    bomNToUpdate.setCodeproduit(bom.getCodeproduit());
                    bomNToUpdate.setCategorieProduit(bom.getCategorie_Produit());
                    bomNToUpdate.setLibellesPf(bom.getLibellesPF());
                    bomNToUpdate.setLibellesMp(bom.getLibellesMP());
                    bomNToUpdate.setTaillelot(bom.getTaillelot());
                    bomNToUpdate.setArticle(bom.getArticle());
                    bomNToUpdate.setQteBesoin(bom.getQte_besoin());
                    bomNToUpdate.setUnite(bom.getUnite());
                    bomNToUpdate.setBom(bom);

                    List<Pdp> productPdps = pdpRepository.findByProduit_ReferenceAndYear(reference, year);
                    if (!productPdps.isEmpty()) {
                        bomNToUpdate.setPdp(productPdps.get(0));
                    } else {
                        continue;
                    }
                } else {
                    bomNToUpdate = existingBomNs.get(0);
                    bomNToUpdate.getResteLancerParMoisMap().entrySet().removeIf(e -> e.getValue().getYear() == year);
                    bomNToUpdate.getBesoinMpParMoisMap().entrySet().removeIf(e -> e.getValue().getYear() == year);
                }

                List<String> allMonths = Arrays.asList("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Sept", "Oct", "Nov", "Déc");
                Map<String, Integer> monthlyValues = new HashMap<>();
                for (String month : allMonths) {
                    monthlyValues.put(month, 0);
                }

                for (Pdp pdp : pdps) {
                    if (pdp.getProduit().getReference().equals(reference) && pdp.getYear() == year) {
                        monthlyValues.put(pdp.getMois(), pdp.getResteLancer());
                        bomNToUpdate.setPdp(pdp);
                    }
                }

                for (Map.Entry<String, Integer> monthEntry : monthlyValues.entrySet()) {
                    String month = monthEntry.getKey();
                    int resteLancer = monthEntry.getValue();
                    if (resteLancer > 0) {
                        bomNToUpdate.addResteLancerParMois(month, resteLancer);
                        if (bomNToUpdate.getQteBesoin() != null) {
                            BigDecimal besoinMpValue = bomNToUpdate.getQteBesoin().multiply(BigDecimal.valueOf(resteLancer));
                            bomNToUpdate.addBesoinMpParMois(month, besoinMpValue);
                        }
                    }
                }

                int lastResteLancer = 0;
                for (int i = allMonths.size() - 1; i >= 0; i--) {
                    String month = allMonths.get(i);
                    if (bomNToUpdate.getResteLancerParMoisMap().containsKey(month)) {
                        int value = bomNToUpdate.getResteLancerParMoisMap().get(month).getValue();
                        if (value > 0) {
                            lastResteLancer = value;
                            break;
                        }
                    }
                }
                bomNToUpdate.setResteLancer(lastResteLancer);
                if (bomNToUpdate.getQteBesoin() != null) {
                    bomNToUpdate.setBesoinMpMois(bomNToUpdate.getQteBesoin().multiply(BigDecimal.valueOf(lastResteLancer)));
                }

                BomN savedBomN = bomNRepository.save(bomNToUpdate);
                resultList.add(savedBomN);
            }
        }
        return resultList;
    }

    public List<BomN> getAllBomN() {
        return bomNRepository.findAll();
    }

    public BomN getBomNById(Long id) {
        return bomNRepository.findById(id).orElse(null);
    }

  
    public Page<BomN> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
    
        if (query == null || query.trim().isEmpty()) {
            return bomNRepository.findAll(pageRequest);
        }
    
        return bomNRepository
            .findByCodeproduitContainingIgnoreCaseOrCategorieProduitContainingIgnoreCaseOrLibellesPfContainingIgnoreCaseOrArticleContainingIgnoreCaseOrLibellesMpContainingIgnoreCase(
                query,
                query,
                query,
                query,
                query,
                pageRequest
            );
    }
    
}
