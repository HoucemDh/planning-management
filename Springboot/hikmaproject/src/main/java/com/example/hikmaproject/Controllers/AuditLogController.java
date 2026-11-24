package com.example.hikmaproject.Controllers;

import java.util.List;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.example.hikmaproject.Models.AuditLog;
import com.example.hikmaproject.repositories.AuditLogRepository;


@Controller
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @QueryMapping
    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAll();
    }
}
