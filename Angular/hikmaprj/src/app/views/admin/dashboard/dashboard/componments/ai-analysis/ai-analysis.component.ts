import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAnalysisService } from '../../../../../../Services/ai-analysis/ai-analysis.service';
import { AnalysisResult } from '../../../../../../Types/ai-analysis.types';
import { AuthService } from '../../../../../../Services/auth/auth.service';


@Component({
  selector: 'app-ai-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-analysis.component.html',
  styleUrls: ['./ai-analysis.component.css']
})

export class AiAnalysisComponent {
  designationInput: string = '';
  shareEmail = '';

  analysisResult: AnalysisResult | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  sharing = false;
  shareSuccess = false;
  shareError = '';


  constructor(private aiAnalysisService: AiAnalysisService ,public authService: AuthService) {}


  generateAiAnalysis(): void {
    const designation = this.designationInput.trim();
    if (designation === '') {
      this.analysisResult = { analysis: 'Veuillez saisir une désignation valide.', recommendedAction: '' };
      return;
    }

    this.loading = true;
    this.analysisResult = null;
    this.errorMessage = '';

    this.aiAnalysisService.analyzeStockByDesignation(designation).subscribe({
      next: (result: AnalysisResult) => {
        this.analysisResult = result;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'analyse du stock:', error);
        this.errorMessage = error.message || 'Erreur inconnue lors de l\'analyse du stock';
        this.analysisResult = {
          analysis: `Erreur lors de l'analyse du stock: ${this.errorMessage}`,
          recommendedAction: 'Vérifiez les logs du serveur et assurez-vous que le service est disponible.'
        };
        this.loading = false;
      }
    });
  }

  viewHistory(): void {
    console.log('Viewing history...');
  }



  shareResults(): void {
    console.log('Sharing results...');
  }

  // Fonction pour tester le service indépendamment
  testConnection(): void {
    console.log('Testing GraphQL connection...');
    // Vous pourriez ajouter ici une requête GraphQL simple pour tester la connexion
  }

  exportResults(): void {
    if (!this.designationInput) { return; }
    this.aiAnalysisService.exportPdf(this.designationInput).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Analyse_${this.designationInput}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur export PDF', err);
      }
    });
  }

  onShareClick(): void {
    this.shareError = '';
    this.shareSuccess = false;
    this.sharing = true;

    this.aiAnalysisService.shareAnalysis(this.designationInput.trim(), this.shareEmail.trim())
      .subscribe({
        next: success => {
          this.sharing = false;
          if (success) {
            this.shareSuccess = true;
          } else {
            this.shareError = 'Échec de l’envoi du mail.';
          }
        },
        error: err => {
          this.sharing = false;
          this.shareError = err.message || 'Erreur inconnue lors de l’envoi.';
        }
      });
  }
}
