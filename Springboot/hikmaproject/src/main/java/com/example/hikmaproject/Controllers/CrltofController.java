package com.example.hikmaproject.Controllers;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import com.example.hikmaproject.Models.Crltof;
import com.example.hikmaproject.services.CrltofService;

import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
@Controller
public class CrltofController {
    private final CrltofService crltofService;

    public CrltofController(CrltofService crltofService) {
        this.crltofService = crltofService;
    }

    @QueryMapping
    public PagedResponse<Crltof> getCrltofPages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<Crltof> crltofPage = crltofService.getAllPaginated(page, size, query);
        return createPagedResponse(crltofPage);
    }

    private PagedResponse<Crltof> createPagedResponse(Page<Crltof> page) {
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
