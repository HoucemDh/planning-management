package com.example.hikmaproject.Controllers;


import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Models.Globalstock;
import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import com.example.hikmaproject.services.Globalstockservice;

@Controller
public class GlobalstockController {

    private final Globalstockservice Globalstockservice;

    public GlobalstockController(Globalstockservice globalstockservice) {
        Globalstockservice = globalstockservice;
    }
    
    @QueryMapping
    public PagedResponse<Globalstock> getAllArticles(
        @Argument Integer page,
        @Argument Integer size,
        @Argument(name ="query") String query
    ) {
        Page<Globalstock> globalStockPage = Globalstockservice.getAllPaginated(page,size, query);
            return createPagedResponse(globalStockPage);
    }
        private PagedResponse<Globalstock>createPagedResponse(Page<Globalstock> page) {
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