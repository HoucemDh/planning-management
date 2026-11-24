package com.example.hikmaproject.repositories;

import com.example.hikmaproject.Models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, String entityId);
}
