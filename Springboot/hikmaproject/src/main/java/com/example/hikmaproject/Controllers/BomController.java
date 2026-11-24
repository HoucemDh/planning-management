package com.example.hikmaproject.Controllers;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import com.example.hikmaproject.Models.Bom;
import com.example.hikmaproject.services.Bomservice;


@Controller
public class BomController {
    private final Bomservice bomService;

    public BomController(Bomservice bomService) {
        this.bomService = bomService;
    }

    @QueryMapping
    public PagedResponse<Bom> getBomPages(
        @Argument int page,
        @Argument int size,
        @Argument(name = "query") String query
    ) {
        Page<Bom> bomPage = bomService.getAllPaginated(page, size, query);
        return createPagedResponse(bomPage);
    }

    private PagedResponse<Bom> createPagedResponse(Page<Bom> page) {
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