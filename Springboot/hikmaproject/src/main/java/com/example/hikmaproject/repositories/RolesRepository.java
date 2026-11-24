package com.example.hikmaproject.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hikmaproject.Models.User_Roles;

import java.util.Optional;
import java.util.Set;

@Repository
public interface RolesRepository extends JpaRepository<User_Roles, Long> {
    Optional<User_Roles> findByName(String name);
    boolean existsByName(String name);
    Set<User_Roles> findByIdIn(Set<Long> ids);
    boolean existsByNameAndIdNot(String name, Long id);
}