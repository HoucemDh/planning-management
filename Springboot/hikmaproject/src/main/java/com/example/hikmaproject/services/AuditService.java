package com.example.hikmaproject.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import com.example.hikmaproject.Models.AuditLog;
import com.example.hikmaproject.repositories.AuditLogRepository;

@Service
public class AuditService {
    private final AuditLogRepository auditLogRepository;
    private final HttpServletRequest request;

    public AuditService(AuditLogRepository auditLogRepository, HttpServletRequest request) {
        this.auditLogRepository = auditLogRepository;
        this.request = request;
    }

    @Transactional
    public void logAuditEvent(String username, String action, String entityType, 
                            String entityId, String oldValue, String newValue) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setOldValue(oldValue);
        auditLog.setNewValue(newValue);
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);
    }
}
