package com.example.hikmaproject.Controllers;

import com.example.hikmaproject.Models.Bom;
import com.example.hikmaproject.Models.BomN;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import com.example.hikmaproject.Models.Pdp;
import com.example.hikmaproject.repositories.BOMRepository;
import com.example.hikmaproject.repositories.PdpRepository;
import com.example.hikmaproject.services.BomNService;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
@Controller
public class BomNController {
    
    @Autowired
    private BomNService bomNService;
    
    @Autowired
    private BOMRepository bomRepository;
    
    @Autowired
    private PdpRepository pdpRepository;
    
    /**
     * Mutation GraphQL qui génère les enregistrements BomN pour l'année donnée.
     * La génération se fait pour tous les mois de l'année.
     */
    @MutationMapping
    public List<BomN> generateBomN(@Argument int year) {
        return bomNService.generateBomN(year);
    }
    
    /**
     * Query GraphQL qui récupère et met à jour les données mensuelles (reste à lancer et besoin MP)
     * pour tous les BomN de l'année donnée.
     */
    @QueryMapping
    public List<BomN> recupererResteLancerParMois(@Argument int year) {
        List<BomN> bomNList = bomNService.recupererResteLancerParMois(year);
        
        // Convertir les Maps en List pour chaque BomN avant de retourner la réponse
        bomNList.forEach(bomN -> {
            bomN.setResteLancerParMois(bomN.getResteLancerParMoisList());
            bomN.setBesoinMpParMois(bomN.getBesoinMpParMoisList());
        });
        
        return bomNList;
    }
    
    /**
     * Query GraphQL pour récupérer un BomN par son identifiant.
     */
    @QueryMapping
    public BomN getBomNById(@Argument Long id) {
        BomN bomN = bomNService.getBomNById(id);
        if (bomN != null) {
            bomN.setResteLancerParMois(bomN.getResteLancerParMoisList());
            bomN.setBesoinMpParMois(bomN.getBesoinMpParMoisList());
        }
        return bomN;
    }
    
    /**
     * Query GraphQL pour récupérer tous les enregistrements BomN.
     */
    @QueryMapping
    public List<BomN> getAllBomN() {
        List<BomN> bomNList = bomNService.getAllBomN();
        bomNList.forEach(bomN -> {
            bomN.setResteLancerParMois(bomN.getResteLancerParMoisList());
            bomN.setBesoinMpParMois(bomN.getBesoinMpParMoisList());
        });
        return bomNList;
    }
    
    /**
     * Query GraphQL pour récupérer les PDP selon le mois et l'année.
     */
    @QueryMapping
    public List<String> getPdpsByMonthAndYear(@Argument String mois, @Argument int year) {
        List<Pdp> pdps = pdpRepository.findByYearAndSearchQuery(year, mois);
        return pdps.stream()
            .map(pdp -> "PDP: " + pdp.getId() + ", Produit: " + pdp.getProduit().getReference())
            .collect(Collectors.toList());
    }
    
    /**
     * Query GraphQL pour récupérer les BOM d'après le code produit.
     */
    @QueryMapping
    public List<String> getBomsByCodeProduit(@Argument String codeproduit) {
        List<Bom> boms = bomRepository.findByCodeproduit(codeproduit);
        return boms.stream()
            .map(bom -> "BOM: " + bom.getId_bom() + ", Codeproduit: " + bom.getCodeproduit())
            .collect(Collectors.toList());
    }
    
    /**
     * Query GraphQL pour récupérer une pagination des enregistrements BomN.
     */
    @QueryMapping
    public PagedResponse<BomN> getBomNPages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<BomN> bomNPage = bomNService.getAllPaginated(page, size, query);

        // Convertir les Maps en List pour chaque BomN
        bomNPage.getContent().forEach(bomN -> {
            bomN.setResteLancerParMois(bomN.getResteLancerParMoisList());
            bomN.setBesoinMpParMois(bomN.getBesoinMpParMoisList());
        });

        return createPagedResponse(bomNPage);
    }

    private PagedResponse<BomN> createPagedResponse(Page<BomN> page) {
        PageInfo pageInfo = new PageInfo(
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.hasNext(),
            page.hasPrevious()
        );
        return new PagedResponse<>(page.getContent(), pageInfo);
    }
}
