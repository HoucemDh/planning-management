package com.example.hikmaproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class HikmaprojectApplication {
    public static void main(String[] args) {
     
        SpringApplication.run(HikmaprojectApplication.class, args);
    }

}