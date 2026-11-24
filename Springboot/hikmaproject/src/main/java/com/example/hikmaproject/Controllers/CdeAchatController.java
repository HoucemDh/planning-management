package com.example.hikmaproject.Controllers;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import com.example.hikmaproject.Models.CdeAchat;
import com.example.hikmaproject.services.CdeAchatService;


@Controller
public class CdeAchatController {
    private final CdeAchatService cdeAchatService;

    public CdeAchatController(CdeAchatService cdeAchatService) {
        this.cdeAchatService = cdeAchatService;
    }
    @MutationMapping
    public String calculateFieldsForAll() {
        cdeAchatService.calculateFieldsForAll();  // Calculer les champs pour toutes les commandes
        return "Tous les champs ont été calculés et mis à jour pour toutes les commandes.";
    }


    @QueryMapping
    public PagedResponse<CdeAchat> getCdeAchatPages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<CdeAchat> cdeAchatPage = cdeAchatService.getAllPaginated(page, size, query);
        return createPagedResponse(cdeAchatPage);
    }

    private PagedResponse<CdeAchat> createPagedResponse(Page<CdeAchat> page) {
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
