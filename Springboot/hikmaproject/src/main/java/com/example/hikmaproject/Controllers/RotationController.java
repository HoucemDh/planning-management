package com.example.hikmaproject.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Models.PageInfo;
import com.example.hikmaproject.Models.PagedResponse;
import com.example.hikmaproject.Models.RotationMp;
import com.example.hikmaproject.services.RotationMpService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class RotationController {

    @Autowired
    private final RotationMpService rotationMpService;


    @QueryMapping
    public PagedResponse<RotationMp> getAllRotationMp(@Argument int page, @Argument int size) {
        Page<RotationMp> rotationPage = rotationMpService.getAllpaginated(page, size);
        return createPagedResponse(rotationPage);
    }

    private PagedResponse<RotationMp> createPagedResponse(Page<RotationMp> page) {
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
