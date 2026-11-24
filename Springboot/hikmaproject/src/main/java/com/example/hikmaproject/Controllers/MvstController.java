package com.example.hikmaproject.Controllers;

import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Models.Mvst;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import com.example.hikmaproject.services.MvstService;

@Controller
public class MvstController {
    public final MvstService MvstService;

    public MvstController(MvstService mvstService) {
        MvstService = mvstService;
    }

    @QueryMapping
    public PagedResponse<Mvst> getMvstPages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<Mvst> mvstStockPage = MvstService.getAllPaginated(page, size, query);
        return createPagedResponse(mvstStockPage);
    }

    private PagedResponse<Mvst> createPagedResponse(Page<Mvst> page) {
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
