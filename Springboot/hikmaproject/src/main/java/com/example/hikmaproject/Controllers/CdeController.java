package com.example.hikmaproject.Controllers;



import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Models.Cde;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import com.example.hikmaproject.services.Cdeservice;

@Controller
public class CdeController {
    private final Cdeservice Cdeservice;

    public CdeController(Cdeservice cdeservice) {
        Cdeservice = cdeservice;
    }

    @QueryMapping
    PagedResponse<Cde> getAllCde(@Argument int size,
                                  @Argument int page,
                                  @Argument(name = "query") String query ){

    Page<Cde> cdeRequestPage = Cdeservice.getAllCommandes(page, size, query);
    return createPagedResponse(cdeRequestPage);
    }

    private PagedResponse<Cde> createPagedResponse(Page<Cde> page) {
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
