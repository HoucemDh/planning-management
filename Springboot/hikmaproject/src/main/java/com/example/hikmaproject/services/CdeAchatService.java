package com.example.hikmaproject.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.hikmaproject.Models.CdeAchat;
import com.example.hikmaproject.repositories.CdeAchatRepository;

@Service
public class CdeAchatService {
    private final CdeAchatRepository cdeAchatRepository;

    public CdeAchatService(CdeAchatRepository cdeAchatRepository) {
        this.cdeAchatRepository = cdeAchatRepository;
    }

    public Page<CdeAchat> getAllPaginated(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size);
        
        if (query == null || query.trim().isEmpty()) {
            return cdeAchatRepository.findAll(pageRequest);
        }
        
        return cdeAchatRepository.findByNoCommandeContainingIgnoreCaseOrArticleContainingIgnoreCaseOrDesignationContainingIgnoreCase(
            query, 
            query, 
            query, 
            pageRequest
        );
    }

    public void calculateFieldsForAll() {
        List<CdeAchat> cdeAchats = cdeAchatRepository.findAll();  // Récupérer toutes les commandes d'achat
        for (CdeAchat cdeAchat : cdeAchats) {
            calculateFields(cdeAchat);  // Appliquer le calcul pour chaque commande
        }
        cdeAchatRepository.saveAll(cdeAchats);  // Sauvegarder toutes les commandes avec les champs calculés
    }

    private void calculateFields(CdeAchat cdeAchat) {
        if (cdeAchat.getDateRecSite() != null) {
            cdeAchat.setMois(cdeAchat.getDateRecSite().getMonth().toString().substring(0, 3).toLowerCase() + "-" + cdeAchat.getDateRecSite().getYear());
        }
    
        LocalDate anneeRef = LocalDate.now(); 
    
        // Si resteLivrer <= 0, set dateCalcul à null (tu peux mettre "-" ou "" ici si tu veux vraiment imiter le "-" Excel)
        if (cdeAchat.getResteLivrer() != null && cdeAchat.getResteLivrer().compareTo(BigDecimal.ZERO) <= 0) {
            cdeAchat.setDateCalcul(null); 
        } 
        // Si Date_rec_site est avant aujourd'hui et Date_recept_prevue est avant aujourd'hui, set dateCalcul à AO1 
        else if (cdeAchat.getDateRecSite() == null && cdeAchat.getDateReceptPrevue() != null && cdeAchat.getDateReceptPrevue().toLocalDate().isBefore(anneeRef)) {
            cdeAchat.setDateCalcul(anneeRef.atStartOfDay()); 
        } 
        // Si Date_rec_site est avant aujourd'hui et Date_recept_prevue est après aujourd'hui, set dateCalcul à Date_recept_prevue
        else if (cdeAchat.getDateRecSite() == null && cdeAchat.getDateReceptPrevue() != null && cdeAchat.getDateReceptPrevue().toLocalDate().isAfter(anneeRef)) {
            cdeAchat.setDateCalcul(cdeAchat.getDateReceptPrevue().toLocalDate().atStartOfDay()); // Remplace Date_recept_prevue par la date appropriée
        }
        // Si Date_rec_site est après ou égale à aujourd'hui, set dateCalcul à Date_rec_site
        else if (cdeAchat.getDateRecSite() != null && cdeAchat.getDateRecSite().toLocalDate().isAfter(anneeRef) || cdeAchat.getDateRecSite().toLocalDate().isEqual(anneeRef)) {
            cdeAchat.setDateCalcul(cdeAchat.getDateRecSite().toLocalDate().atStartOfDay()); // Remplace Date_rec_site par la date appropriée
        }
        // Si Date_rec_site est avant aujourd'hui, set dateCalcul à aujourd'hui
        else if (cdeAchat.getDateRecSite() != null && cdeAchat.getDateRecSite().toLocalDate().isBefore(anneeRef)) {
            cdeAchat.setDateCalcul(anneeRef.atStartOfDay()); // Remplace $AN$1 par aujourd'hui
        }
    }
    
    

} 
