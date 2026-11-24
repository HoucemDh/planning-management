package com.example.hikmaproject.Controllers;

import com.example.hikmaproject.Models.Pdp;
import com.example.hikmaproject.Models.Produit;
import com.example.hikmaproject.services.AuditService;
import com.example.hikmaproject.services.PdpService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
public class PdpController {
    private final PdpService pdpService;
    private final AuditService auditService;

    public PdpController(PdpService pdpService, AuditService auditService) {
        this.pdpService = pdpService;
        this.auditService = auditService;
    }

    @MutationMapping
    public Pdp addPlan(@Argument String libelle, @Argument String mois, @Argument int prevueLancer,
                       @Argument int lancerActuelle, @Argument int tailleLot, @Argument int year) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Capture state before creation
        String oldValue = "{}"; // No previous state for creation
        
        // Create the plan
        Pdp result = pdpService.addPlan(libelle, mois, prevueLancer, lancerActuelle, tailleLot, year);
        
        // Create new value JSON safely
        String newValue = String.format(
            "{\"libelle\": \"%s\", \"ref\": \"%s\", \"mois\": \"%s\", \"year\": \"%d\", " +
            "\"prevueLancer\": \"%d\", \"lancerActuelle\": \"%d\", \"resteLancer\": \"%d\", \"tailleLot\": \"%d\"}", 
            result.getLibelle() != null ? result.getLibelle() : "",
            result.getRef() != null ? result.getRef() : "",
            result.getMois() != null ? result.getMois() : "",
            result.getYear(),
            result.getPrevueLancer(),
            result.getLancerActuelle(),
            result.getResteLancer(),
            result.getTailleLot()
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "ADD_PLAN",
            "Pdp",
            result.getId() != null ? result.getId().toString() : "unknown",
            oldValue,
            newValue
        );
        
        return result;
    }

    @QueryMapping
    public List<Pdp> getPlans() {
        return pdpService.getAllPlans();
    }

    @QueryMapping
    public List<Pdp> getPlansByYear(@Argument int year) {
        return pdpService.getPlansByYear(year);
    }

    @QueryMapping
    public List<String> getLibelles() {
        return pdpService.getLibelles();
    }

    @QueryMapping
    public Produit getProductByLibelle(@Argument String libelle) {
        return pdpService.getProductByLibelle(libelle);
    }

    @QueryMapping
    public List<Pdp> searchPlans(@Argument int year, @Argument String libelle) {
        return pdpService.searchPlans(year, libelle);
    }

    @MutationMapping
    public Pdp updatePlanByLibelle(@Argument String libelle, @Argument int year, @Argument String mois,
                                   @Argument int prevueLancer, @Argument int lancerActuelle) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Fetch existing plan to capture state before update
        Pdp existingPlan = pdpService.findPlanByLibelleYearAndMonth(libelle, year, mois);
        
        // Capture old value as JSON
        String oldValue = String.format(
            "{\"libelle\": \"%s\", \"ref\": \"%s\", \"mois\": \"%s\", \"year\": \"%d\", " +
            "\"prevueLancer\": \"%d\", \"lancerActuelle\": \"%d\", \"resteLancer\": \"%d\", \"tailleLot\": \"%d\"}", 
            existingPlan.getLibelle() != null ? existingPlan.getLibelle() : "",
            existingPlan.getRef() != null ? existingPlan.getRef() : "",
            existingPlan.getMois() != null ? existingPlan.getMois() : "",
            existingPlan.getYear(),
            existingPlan.getPrevueLancer(),
            existingPlan.getLancerActuelle(),
            existingPlan.getResteLancer(),
            existingPlan.getTailleLot()
        );
        
        // Update the plan
        Pdp result = pdpService.updatePlanByLibelle(libelle, year, mois, prevueLancer, lancerActuelle);
        
        // Create new value JSON
        String newValue = String.format(
            "{\"libelle\": \"%s\", \"ref\": \"%s\", \"mois\": \"%s\", \"year\": \"%d\", " +
            "\"prevueLancer\": \"%d\", \"lancerActuelle\": \"%d\", \"resteLancer\": \"%d\", \"tailleLot\": \"%d\"}", 
            result.getLibelle() != null ? result.getLibelle() : "",
            result.getRef() != null ? result.getRef() : "",
            result.getMois() != null ? result.getMois() : "",
            result.getYear(),
            result.getPrevueLancer(),
            result.getLancerActuelle(),
            result.getResteLancer(),
            result.getTailleLot()
        );
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            "UPDATE_PLAN",
            "Pdp",
            result.getId() != null ? result.getId().toString() : "unknown",
            oldValue,
            newValue
        );
        
        return result;
    }
}