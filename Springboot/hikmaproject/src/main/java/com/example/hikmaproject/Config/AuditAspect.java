package com.example.hikmaproject.Config;

import com.example.hikmaproject.audit.Audited;
import com.example.hikmaproject.services.AuditService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import com.example.hikmaproject.Models.AppUser;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {
    private final AuditService auditService;

    public AuditAspect(AuditService auditService) {
        this.auditService = auditService;
    }

    @Around("@annotation(graphql.GraphQLMutation)")
    public Object auditGraphQLMutation(ProceedingJoinPoint joinPoint) throws Throwable {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        // Capture the state before the mutation
        String oldValue = captureState(args);
        
        // Execute the mutation
        Object result = joinPoint.proceed();
        
        // Capture the state after the mutation
        String newValue = captureState(result);
        
        // Log the audit event
        auditService.logAuditEvent(
            username,
            methodName,
            determineEntityType(joinPoint),
            extractEntityId(args),
            oldValue,
            newValue
        );
        
        return result;
    }

    private String captureState(Object obj) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            return obj.toString();
        }
    }

    private String determineEntityType(ProceedingJoinPoint joinPoint) {
        // Extract entity type from the method or args
        return joinPoint.getSignature().getDeclaringType().getSimpleName();
    }

    private String extractEntityId(Object[] args) {
        // Extract entity ID from the arguments
        if (args != null && args.length > 0 && args[0] != null) {
            return args[0].toString();
        }
        return null;
    }
}