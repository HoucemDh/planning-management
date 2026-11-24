package com.example.hikmaproject.services;

import org.springframework.core.io.ByteArrayResource;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
        mailSender.send(message);
    }

    public void sendEmailWithAttachment(
            String to,
            String subject,
            String htmlContent,
            byte[] attachmentBytes,
            String attachmentFilename
    ) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        // second param = true pour multipart
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        // Ajout de la pièce jointe
        helper.addAttachment(attachmentFilename, new ByteArrayResource(attachmentBytes));
        mailSender.send(message);
    }
}
