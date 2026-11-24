package com.example.hikmaproject.Controllers;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import com.example.hikmaproject.services.OfencService;
import com.example.hikmaproject.Models.Ofenc;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;

@Controller
public class OfencController {

    private final OfencService ofencService;

    public OfencController(OfencService ofencService) {
        this.ofencService = ofencService;
    }

    @QueryMapping
    public PagedResponse<Ofenc> getOfencPages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<Ofenc> ofencPage = ofencService.getAllPaginated(page, size, query);
        return createPagedResponse(ofencPage);
    }

    private PagedResponse<Ofenc> createPagedResponse(Page<Ofenc> page) {
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
