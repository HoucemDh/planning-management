package com.example.hikmaproject.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.hikmaproject.Models.RotationMp;
import com.example.hikmaproject.repositories.RotationRepo;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class RotationMpService {

    @Autowired
    private final RotationRepo rotationRepo;

    public Page<RotationMp> getAllpaginated(int page, int size){
        Page<RotationMp> pageRotationMp = rotationRepo.findAll(PageRequest.of(page, size));
        return pageRotationMp;
    }
}
