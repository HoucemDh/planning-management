import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, catchError, Observable, throwError } from 'rxjs';
import { AnalysisResult } from '../../Types/ai-analysis.types';

const ANALYZE_BY_DESIGNATION = gql`
  mutation analyzeStockByDesignation($designation: String!) {
    AnalysisResult(designation: $designation) {
      analysis
      recommendedAction
    }
  }
`;

const EXPORT_PDF = gql`
  mutation exportAnalysisPdf($designation: String!) {
    exportAnalysisPdf(designation: $designation)
  }
`;

const SHARE_ANALYSIS = gql`
  mutation shareAnalysis($designation: String!, $email: String!) {
    shareAnalysisByEmail(designation: $designation, email: $email)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AiAnalysisService {
  constructor(private apollo: Apollo) {}

  analyzeStockByDesignation(designation: string): Observable<AnalysisResult> {
    console.log('Requesting analysis for designation:', designation);

    return this.apollo
      .mutate<{ AnalysisResult: AnalysisResult }>({
        mutation: ANALYZE_BY_DESIGNATION,
        variables: { designation }
      })
      .pipe(
        map(result => {
          console.log('Analysis result received:', result);
          if (!result.data || !result.data.AnalysisResult) {
            throw new Error('Données manquantes dans la réponse');
          }
          return result.data.AnalysisResult;
        }),
        catchError(error => {
          console.error('GraphQL error:', error);
          // Vérifier si l'erreur contient des détails spécifiques de GraphQL
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            console.error('GraphQL specific errors:', error.graphQLErrors);
          }
          return throwError(() => new Error(`Erreur d'analyse: ${error.message}`));
        })
      );
  }


  exportPdf(designation: string): Observable<Blob> {
    return this.apollo.mutate<{ exportAnalysisPdf: string }>({
      mutation: EXPORT_PDF,
      variables: { designation }
    }).pipe(
      map(res => {
        const base64 = res.data?.exportAnalysisPdf;
        const byteChars = atob(base64!);
        const byteNumbers = Array.from(byteChars).map(c => c.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'application/pdf' });
      })
    );
  }

  shareAnalysis(designation: string, email: string): Observable<boolean> {
    return this.apollo.mutate<{ shareAnalysisByEmail: boolean }>({
      mutation: SHARE_ANALYSIS,
      variables: { designation, email }
    }).pipe(
      map(res => {
        if (res.data == null) {
          throw new Error('Aucune réponse du serveur');
        }
        return res.data.shareAnalysisByEmail;
      })
    );
  }

}
