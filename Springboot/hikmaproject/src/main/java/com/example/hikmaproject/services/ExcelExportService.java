package com.example.hikmaproject.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

@Service
public class ExcelExportService {

    /**
     * Génère un fichier Excel (XLSX) à partir d'un tableau de chaînes.
     * @param rows Liste des lignes (chaque ligne est un tableau de colonnes)
     * @param headers En-têtes de colonnes
     * @param sheetName Nom de la feuille Excel
     * @return Fichier Excel sous forme de flux mémoire
     * @throws IOException En cas d'erreur d'écriture
     */
    public ByteArrayOutputStream buildWorkbook(
            List<String[]> rows,
            String[] headers,
            String sheetName
    ) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(sheetName);

            // Style pour l'en-tête (gras)
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Écriture de l'en-tête
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Écriture des données
            for (int r = 0; r < rows.size(); r++) {
                Row row = sheet.createRow(r + 1);
                String[] data = rows.get(r);
                for (int c = 0; c < data.length; c++) {
                    row.createCell(c).setCellValue(data[c] != null ? data[c] : "");
                }
            }

            // Ajustement automatique des colonnes
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Écriture en mémoire
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out;
        }
    }
}
