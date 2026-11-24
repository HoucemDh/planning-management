package com.example.hikmaproject.Controllers;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import com.example.hikmaproject.Models.CdeVente;
import com.example.hikmaproject.services.CdeVenteService;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;

@Controller
public class CdeVenteController {
    private final CdeVenteService cdeVenteService;

    public CdeVenteController(CdeVenteService cdeVenteService) {
        this.cdeVenteService = cdeVenteService;
    }

    @QueryMapping
    public PagedResponse<CdeVente> getCdeVentePages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<CdeVente> cdeVentePage = cdeVenteService.getAllPaginated(page, size, query);
        return createPagedResponse(cdeVentePage);
    }

    private PagedResponse<CdeVente> createPagedResponse(Page<CdeVente> page) {
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
