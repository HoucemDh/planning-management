import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, map, throwError } from 'rxjs';

const PLAN_FIELDS = gql`
  fragment PlanFields on Plan {
    id
    libelle
    mois
    prevueLancer
    lancerActuelle
    resteLancer
    tailleLot
    year
    produit {
      id
      libelle
      reference
      tailleLot
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private readonly GET_PLANS = gql`
    ${PLAN_FIELDS}
    query getPlans {
      getPlans {
        ...PlanFields
      }
    }
  `;

  private readonly ADD_PLAN = gql`
    ${PLAN_FIELDS}
    mutation addPlan(
      $libelle: String!,
      $mois: String!,
      $prevueLancer: Int!,
      $lancerActuelle: Int!,
      $tailleLot: Int!,
      $year: Int!
    ) {
      addPlan(
        libelle: $libelle,
        mois: $mois,
        prevueLancer: $prevueLancer,
        lancerActuelle: $lancerActuelle,
        tailleLot: $tailleLot,
        year: $year
      ) {
        ...PlanFields
      }
    }
  `;

  private readonly GET_LIBELLES = gql`
    query getLibelles {
      getLibelles
    }
  `;

  private readonly GET_PLANS_BY_YEAR = gql`
    ${PLAN_FIELDS}
    query getPlansByYear($year: Int!) {
      getPlansByYear(year: $year) {
        ...PlanFields
      }
    }
  `;

  private readonly GET_PRODUCT_BY_LIBELLE = gql`
    query getProductByLibelle($libelle: String!) {
      getProductByLibelle(libelle: $libelle) {
        id
        libelle
        reference
        tailleLot
      }
    }
  `;

private readonly SEARCH_PLANS = gql`
  ${PLAN_FIELDS}
  query searchPlans($year: Int!, $libelle: String!) {
    searchPlans(year: $year, libelle: $libelle) {
      ...PlanFields
    }
  }
`;

private readonly UPDATE_PLAN = gql`
    ${PLAN_FIELDS}
    mutation updatePlanByLibelle(
      $libelle: String!
      $year: Int!
      $mois: String!
      $prevueLancer: Int!
      $lancerActuelle: Int!
    ) {
      updatePlanByLibelle(
        libelle: $libelle
        year: $year
        mois: $mois
        prevueLancer: $prevueLancer
        lancerActuelle: $lancerActuelle
      ) {
        ...PlanFields
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  getPlans(): Observable<any> {
    return this.apollo
      .watchQuery<{ getPlans: any[] }>({
        query: this.GET_PLANS,
      })
      .valueChanges.pipe(map(result => result.data.getPlans));
  }

  addPlan(
    libelle: string,
    mois: string,
    prevueLancer: number,
    lancerActuelle: number,
    tailleLot: number,
    year: number
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: this.ADD_PLAN,
      variables: { libelle, mois, prevueLancer, lancerActuelle, tailleLot, year },
    });
  }

  getLibelles(): Observable<any> {
    return this.apollo
      .watchQuery<{ getLibelles: string[] }>({
        query: this.GET_LIBELLES,
      })
      .valueChanges.pipe(map(result => result.data.getLibelles));
  }

  getPlansByYear(year: number): Observable<any> {
    return this.apollo
      .watchQuery<{ getPlansByYear: any[] }>({
        query: this.GET_PLANS_BY_YEAR,
        variables: { year },
      })
      .valueChanges.pipe(map(result => result.data.getPlansByYear));
  }

  getProductByLibelle(libelle: string): Observable<any> {
    return this.apollo
      .watchQuery<{ getProductByLibelle: any }>({
        query: this.GET_PRODUCT_BY_LIBELLE,
        variables: { libelle },
      })
      .valueChanges.pipe(map(result => result.data.getProductByLibelle));
  }

  searchPlans(year: number, libelle: string): Observable<any> {
    if (!libelle || !libelle.trim()) {
      throw new Error("The 'libelle' parameter is required and cannot be empty.");
    }

    return this.apollo
      .watchQuery<{ searchPlans: any[] }>({
        query: this.SEARCH_PLANS,
        variables: { year, libelle },
      })
      .valueChanges.pipe(map(result => result.data.searchPlans));
  }

  updatePlan(
    libelle: string,
    year: number,
    mois: string,
    prevueLancer: number,
    lancerActuelle: number
  ): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.UPDATE_PLAN,
        variables: { libelle, year, mois, prevueLancer, lancerActuelle },
      })
      .pipe(
        map(result => {
          console.log('Plan updated successfully', result);
          return result;
        }),
        catchError(error => {
          // Log complet pour débogage
          console.error('Full ApolloError object:', error);
          if (error.networkError && (error.networkError as any).result) {
            console.error('NetworkError.result:', (error.networkError as any).result);
          }
          if (error.graphQLErrors?.length) {
            error.graphQLErrors.forEach((gqlErr: any, idx: number) =>
              console.error(`GraphQLError #${idx}:`, gqlErr)
            );
          }

          // Construire un message utilisateur
          let errorMessage = "Une erreur est survenue lors de la mise à jour du plan.";
          if (error.graphQLErrors?.[0]?.message) {
            errorMessage = `Erreur GraphQL: ${error.graphQLErrors[0].message}`;
          } else if (error.networkError) {
            errorMessage = "Erreur de connexion au serveur.";
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }


}
