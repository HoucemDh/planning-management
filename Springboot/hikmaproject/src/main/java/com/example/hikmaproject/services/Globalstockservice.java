package com.example.hikmaproject.services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.hikmaproject.repositories.Gstockrepository;
import com.example.hikmaproject.Models.Globalstock;

@Service
public class Globalstockservice {
    private final Gstockrepository Gstockrepository;

    public Globalstockservice(Gstockrepository Gstockrepository) {
        this.Gstockrepository = Gstockrepository;
    }
   
    public Page <Globalstock> getAllPaginated(int page,int size, String query){
        PageRequest pageRequest = PageRequest.of(page, size);

        if(query == null || query.trim().isEmpty())
        {
            return Gstockrepository.findAll(pageRequest);
        }

        return Gstockrepository.findByArticleContainingIgnoreCaseOrDesignationContainingIgnoreCaseOrLotContainingIgnoreCase(query, query, query, pageRequest);
}
}
